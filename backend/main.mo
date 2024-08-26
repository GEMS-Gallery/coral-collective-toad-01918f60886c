import Bool "mo:base/Bool";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Option "mo:base/Option";

actor {
  // Types
  type Note = {
    id: Nat;
    title: Text;
    content: Text;
    categoryId: ?Nat;
    createdAt: Time.Time;
  };

  type Category = {
    id: Nat;
    name: Text;
  };

  type Todo = {
    id: Nat;
    title: Text;
    completed: Bool;
    createdAt: Time.Time;
  };

  // Stable storage
  stable var noteEntries : [(Nat, Note)] = [];
  stable var categoryEntries : [(Nat, Category)] = [];
  stable var todoEntries : [(Nat, Todo)] = [];

  // Mutable state
  var noteStorage = HashMap.fromIter<Nat, Note>(noteEntries.vals(), 0, Nat.equal, Nat.hash);
  var categoryStorage = HashMap.fromIter<Nat, Category>(categoryEntries.vals(), 0, Nat.equal, Nat.hash);
  var todoStorage = HashMap.fromIter<Nat, Todo>(todoEntries.vals(), 0, Nat.equal, Nat.hash);
  var noteIdCounter : Nat = 0;
  var categoryIdCounter : Nat = 0;
  var todoIdCounter : Nat = 0;

  // Note management
  public func createNote(title: Text, content: Text, categoryId: ?Nat) : async Result.Result<Note, Text> {
    switch (categoryId) {
      case (null) {
        noteIdCounter += 1;
        let note : Note = {
          id = noteIdCounter;
          title = title;
          content = content;
          categoryId = null;
          createdAt = Time.now();
        };
        noteStorage.put(noteIdCounter, note);
        #ok(note)
      };
      case (?id) {
        switch (categoryStorage.get(id)) {
          case (null) { #err("Category not found") };
          case (_) {
            noteIdCounter += 1;
            let note : Note = {
              id = noteIdCounter;
              title = title;
              content = content;
              categoryId = ?id;
              createdAt = Time.now();
            };
            noteStorage.put(noteIdCounter, note);
            #ok(note)
          };
        };
      };
    };
  };

  public func updateNote(id: Nat, title: Text, content: Text, categoryId: ?Nat) : async Result.Result<Note, Text> {
    switch (noteStorage.get(id)) {
      case (null) { #err("Note not found") };
      case (?existingNote) {
        switch (categoryId) {
          case (null) {
            let updatedNote : Note = {
              id = existingNote.id;
              title = title;
              content = content;
              categoryId = null;
              createdAt = existingNote.createdAt;
            };
            noteStorage.put(id, updatedNote);
            #ok(updatedNote)
          };
          case (?catId) {
            switch (categoryStorage.get(catId)) {
              case (null) { #err("Category not found") };
              case (_) {
                let updatedNote : Note = {
                  id = existingNote.id;
                  title = title;
                  content = content;
                  categoryId = ?catId;
                  createdAt = existingNote.createdAt;
                };
                noteStorage.put(id, updatedNote);
                #ok(updatedNote)
              };
            };
          };
        };
      };
    };
  };

  public func deleteNote(id: Nat) : async Bool {
    switch (noteStorage.remove(id)) {
      case (null) { false };
      case (?_) { true };
    }
  };

  public query func getNotes() : async [Note] {
    Iter.toArray(noteStorage.vals())
  };

  // Category management
  public func createCategory(name: Text) : async Nat {
    categoryIdCounter += 1;
    let category : Category = {
      id = categoryIdCounter;
      name = name;
    };
    categoryStorage.put(categoryIdCounter, category);
    categoryIdCounter
  };

  public func updateCategory(id: Nat, name: Text) : async Bool {
    switch (categoryStorage.get(id)) {
      case (null) { false };
      case (?existingCategory) {
        let updatedCategory : Category = {
          id = existingCategory.id;
          name = name;
        };
        categoryStorage.put(id, updatedCategory);
        true
      };
    }
  };

  public func deleteCategory(id: Nat) : async Bool {
    switch (categoryStorage.remove(id)) {
      case (null) { false };
      case (?_) { true };
    }
  };

  public query func getCategories() : async [Category] {
    Iter.toArray(categoryStorage.vals())
  };

  // TODO list management
  public func createTodo(title: Text, completed: Bool) : async Nat {
    todoIdCounter += 1;
    let todo : Todo = {
      id = todoIdCounter;
      title = title;
      completed = completed;
      createdAt = Time.now();
    };
    todoStorage.put(todoIdCounter, todo);
    todoIdCounter
  };

  public func updateTodo(id: Nat, title: Text, completed: Bool) : async Bool {
    switch (todoStorage.get(id)) {
      case (null) { false };
      case (?existingTodo) {
        let updatedTodo : Todo = {
          id = existingTodo.id;
          title = title;
          completed = completed;
          createdAt = existingTodo.createdAt;
        };
        todoStorage.put(id, updatedTodo);
        true
      };
    }
  };

  public func deleteTodo(id: Nat) : async Bool {
    switch (todoStorage.remove(id)) {
      case (null) { false };
      case (?_) { true };
    }
  };

  public query func getTodos() : async [Todo] {
    Iter.toArray(todoStorage.vals())
  };

  // Upgrade hooks
  system func preupgrade() {
    noteEntries := Iter.toArray(noteStorage.entries());
    categoryEntries := Iter.toArray(categoryStorage.entries());
    todoEntries := Iter.toArray(todoStorage.entries());
  };

  system func postupgrade() {
    noteEntries := [];
    categoryEntries := [];
    todoEntries := [];
  };
}
