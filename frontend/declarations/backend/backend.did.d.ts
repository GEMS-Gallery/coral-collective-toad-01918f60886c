import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Category { 'id' : bigint, 'name' : string }
export interface Note {
  'id' : bigint,
  'categoryId' : [] | [bigint],
  'title' : string,
  'content' : string,
  'createdAt' : Time,
}
export type Result = { 'ok' : boolean } |
  { 'err' : string };
export type Result_1 = { 'ok' : bigint } |
  { 'err' : string };
export type Time = bigint;
export interface Todo {
  'id' : bigint,
  'title' : string,
  'createdAt' : Time,
  'completed' : boolean,
}
export interface _SERVICE {
  'createCategory' : ActorMethod<[string], bigint>,
  'createNote' : ActorMethod<[string, string, [] | [bigint]], Result_1>,
  'createTodo' : ActorMethod<[string, boolean], bigint>,
  'deleteCategory' : ActorMethod<[bigint], boolean>,
  'deleteNote' : ActorMethod<[bigint], boolean>,
  'deleteTodo' : ActorMethod<[bigint], boolean>,
  'getCategories' : ActorMethod<[], Array<Category>>,
  'getNotes' : ActorMethod<[], Array<Note>>,
  'getTodos' : ActorMethod<[], Array<Todo>>,
  'updateCategory' : ActorMethod<[bigint, string], boolean>,
  'updateNote' : ActorMethod<[bigint, string, string, [] | [bigint]], Result>,
  'updateTodo' : ActorMethod<[bigint, string, boolean], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
