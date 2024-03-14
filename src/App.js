import React, { useState, useEffect } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import Todo from './Todo';
import { db } from './firebase';
import { query, collection, onSnapshot, updateDoc, doc, addDoc, deleteDoc, } from 'firebase/firestore';

const style = {
  bg: `h-screen w-screen p-4 bg-gradient-to-r from-[#ff00e6] to-[#fffafe]`,
  container: `bg-slate-100 max-w-[500px] w-full m-auto rounded-md shadow-xl p-4`,
  heading: `text-3xl font-bold text-center text-gray-800 p-2`,
  form: `flex justify-between`,
  input: `border p-2 w-full text-xl`,
  button: `border p-4 ml-2 bg-[#2F80ED] text-slate-100`,
  count: `text-center p-2`,
};

function App() {
  const [todos, setTodo] = useState([]);
  const [input, setInput] = useState('');

  const createTodo = async (e) => {
    e.preventDefault();
    if (!input.trim()) {
      alert('Please enter a valid todo');
      return;
    }
    await addDoc(collection(db, 'todo'), {
      text: input,
      completed: false,
    });
    setInput('');
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'todo'), (querySnapshot) => {
      const todosArr = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setTodo(todoArr);
    });
    return () => unsubscribe();
  }, []);

  const toggleComplete = async (todo) => {
    await updateDoc(doc(db, 'todo', todo.id), {
      completed: !todo.completed,
    });
  };

  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, 'todo', id));
  };

  return (
    <div className={style.bg}>
      <div className={style.container}>
        <h3 className={style.heading}>Todo App</h3>
        <form onSubmit={createTodo} className={style.form}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={style.input}
            type='text'
            placeholder='Add Todo'
          />
          <button type='submit' className={style.button}>
            <AiOutlinePlus size={30} />
          </button>
        </form>
        <ul>
          {todos.map((todo) => (
            <Todo
              key={todo.id}
              todo={todo}
              toggleComplete={toggleComplete}
              deleteTodo={deleteTodo}
            />
          ))}
        </ul>
        {todos.length > 0 && (
          <p className={style.count}>{`You have ${todo.length} todo`}</p>
        )}
      </div>
    </div>
  );
}

export default App;
