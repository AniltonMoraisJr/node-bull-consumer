import RedisCli from '../redis';
import { Queues } from '../enums';
import BaseQueue from './base.queue';
import { Vote } from '../database/entities/Vote';
import { voteReposity } from '../database/repositories/VoteRepository';
import AppDataSource from '../database';
import { socketIo } from '../server';
import transport from '../email';
import configs from '../configs';

interface VoteMessage {
  partyNumber: number;
}

const redis = RedisCli.getInstance();

export default class VoteQueue extends BaseQueue {
  private static instance: VoteQueue;
  public static getInstance(): VoteQueue {
    if (!VoteQueue.instance) {
      VoteQueue.instance = new VoteQueue();
    }
    return VoteQueue.instance;
  }

  private constructor() {
    super(Queues.vote);
    this.queue.process((data) => this.process(data));
  }

  private process({ data }) {
    const { partyNumber } = data as VoteMessage;
    const vote = {
      partyNumber,
    };
    this.createVote(vote);
  }

  private async createVote(vote: VoteMessage) {
    const partyNumber = vote.partyNumber;
    const newVote = new Vote();
    newVote.partyNumber = vote.partyNumber;

    await voteReposity.save(newVote);

    const votes = await AppDataSource.manager.countBy(Vote, {
      partyNumber: partyNumber,
    });

    await this.setVotes(partyNumber, votes);
  }

  private async setVotes(partyNumber: number, votesQuantity: number) {
    let votes = await redis.getJSON('votes');

    if (votes === undefined || !votes) {
      votes = {};
    }
    if (!votes[partyNumber]) {
      votes[partyNumber] = 0;
    }
    votes[partyNumber] = votesQuantity;
    await redis.setJSON('votes', votes);

    this.sendEmail();
    this.emitSocket(votes);
  }

  private emitSocket(votes) {
    socketIo.emit('votes', votes);
    console.log('Votos enviados via Socket');
  }

  private async sendEmail() {
    await transport.sendMail({
      to: configs.mail.default.to,
      from: configs.mail.default.from,
      subject: 'Voto computado com sucesso',
      text: 'Uhuuul',
    });
    console.log(`E-mail enviado com sucesso.`);
  }
}
