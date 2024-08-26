export const idlFactory = ({ IDL }) => {
  const Result_1 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const Category = IDL.Record({ 'id' : IDL.Nat, 'name' : IDL.Text });
  const Time = IDL.Int;
  const Note = IDL.Record({
    'id' : IDL.Nat,
    'categoryId' : IDL.Opt(IDL.Nat),
    'title' : IDL.Text,
    'content' : IDL.Text,
    'createdAt' : Time,
  });
  const Todo = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Text,
    'createdAt' : Time,
    'completed' : IDL.Bool,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Bool, 'err' : IDL.Text });
  return IDL.Service({
    'createCategory' : IDL.Func([IDL.Text], [IDL.Nat], []),
    'createNote' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Opt(IDL.Nat)],
        [Result_1],
        [],
      ),
    'createTodo' : IDL.Func([IDL.Text, IDL.Bool], [IDL.Nat], []),
    'deleteCategory' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'deleteNote' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'deleteTodo' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'getCategories' : IDL.Func([], [IDL.Vec(Category)], ['query']),
    'getNotes' : IDL.Func([], [IDL.Vec(Note)], ['query']),
    'getTodos' : IDL.Func([], [IDL.Vec(Todo)], ['query']),
    'updateCategory' : IDL.Func([IDL.Nat, IDL.Text], [IDL.Bool], []),
    'updateNote' : IDL.Func(
        [IDL.Nat, IDL.Text, IDL.Text, IDL.Opt(IDL.Nat)],
        [Result],
        [],
      ),
    'updateTodo' : IDL.Func([IDL.Nat, IDL.Text, IDL.Bool], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
