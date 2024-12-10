// dexie.ts
import Dexie, { Table } from 'dexie';
import { Todo } from './types/todo';

export class AppDB extends Dexie {
  todos!: Table<Todo>;

  constructor() {
    super('epiccTelaDB');
    this.version(1).stores({
      collection_last_updated_at: 'name, last_updated_at',
      todos: 'id, text, completed, created_at, updated_at'
    });
  }
}

export const dexie = new AppDB();
