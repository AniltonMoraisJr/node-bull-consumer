import { Candidate } from '../database/entities/Candidate';
import { candidateReposity } from '../database/repositories/CandidateRepository';
import RedisCli from '../redis';
import { Queues } from '../enums';
import BaseQueue from './base.queue';

import { socketIo } from '../server';

interface CandidateMessage {
  name: string;
  partyNumber: number;
  photo: string;
}

const redis = RedisCli.getInstance();

export default class CandidateQueue extends BaseQueue {
  private static instance: CandidateQueue;
  public static getInstance(): CandidateQueue {
    if (!CandidateQueue.instance) {
      CandidateQueue.instance = new CandidateQueue();
    }
    return CandidateQueue.instance;
  }

  private constructor() {
    super(Queues.candidate);
    this.queue.process((data) => this.process(data));
  }

  private process({ data }) {
    console.log(data);
    const { name, partyNumber, photo } = data;
    const candidate = {
      name,
      partyNumber,
      photo,
    };
    this.createCandidate(candidate);
  }

  private async createCandidate(candidate: CandidateMessage) {
    const newCandidate = new Candidate();
    newCandidate.name = candidate.name;
    newCandidate.partyNumber = candidate.partyNumber;
    newCandidate.photo = candidate.photo;

    await candidateReposity.save(newCandidate);

    const candidates = await candidateReposity.find();
    await redis.setJSON('candidates', candidates);
    this.emitSocket(candidates);
  }

  private emitSocket(candidates) {
    socketIo.emit('candidates', candidates);
    console.log('Candidatos enviados via Socket');
  }
}
