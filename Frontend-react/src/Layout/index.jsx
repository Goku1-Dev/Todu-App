import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './index.scss';

const Layout = () => {
    const [todoList, setTodoList] = useState([]);
    const [newTodoName, setNewTodoName] = useState('');
    const [editIndex, setEditIndex] = useState(null);
    const [editTodoName, setEditTodoName] = useState('');

    // Fetch todos
    useEffect(() => {
    const fetchUsers = async () => {
        try {
        const response = await axios.get('http://localhost:8000/user');
        setTodoList(response.data);
        } catch (error) {
        console.error('Error fetching users:', error);
        }
    };
    fetchUsers();
    }, []);

    // Add todo
    const handleAddTodo = async () => {
    if (!newTodoName.trim()) return;
    try {
        const response = await axios.post('http://localhost:8000/create', {
        name: newTodoName,
        });
        setTodoList(prev => [...prev, response.data]);
        setNewTodoName('');
    } catch (error) {
        console.error('Error adding todo:', error);
    }
    };

    // Start editing
    const startEdit = (index, currentName) => {
    setEditIndex(index);
    setEditTodoName(currentName);
    };

    // Submit edit
    const handleEditTodo = async (id) => {
    if (!editTodoName.trim()) return;
    try {
        await axios.put(`http://localhost:8000/user/${id}`, {
        name: editTodoName,
        });
        const updatedList = [...todoList];
        updatedList[editIndex].name = editTodoName;
        setTodoList(updatedList);
        setEditIndex(null);
        setEditTodoName('');
    } catch (error) {
        console.error('Error editing todo:', error);
    }
    };

    // Delete todo
    const handleDeleteTodo = async (id) => {
    try {
        await axios.delete(`http://localhost:8000/user/${id}`);
        setTodoList(prev => prev.filter(todo => todo.id !== id));
    } catch (error) {
        console.error('Error deleting todo:', error);
    }
    };

    return (
    <div className='layout_container'>
        <div className='layout_wrapper'>
        <div className='layout_header'>
            <div className='layout_header_title'>Todo App</div>
            <div className='layout_header_todoInput'>
            <input
                type='text'
                className='layout_header_input'
                value={newTodoName}
                onChange={e => setNewTodoName(e.target.value)}
                placeholder='New todo field'
            />
            </div>
            <button className='layout_add_button' onClick={handleAddTodo}>Add</button>
        </div>

        <div className='layout_body'>
            {todoList.map((todo, index) => (
            <div key={todo.id} className='todo_item'>
                {editIndex === index ? (
                <>
                    <input
                    type='text'
                    value={editTodoName}
                    onChange={(e) => setEditTodoName(e.target.value)}
                    className='todo_item_input'
                    />
                    <button onClick={() => handleEditTodo(todo.id)} className='todo_item_update'>Save</button>
                </>
                ) : (
                <>
                    <div className='todo_item_name'>{index + 1}. {todo.name}</div>
                    <button onClick={() => startEdit(index, todo.name)} className='todo_item_update'>Edit</button>
                </>
                )}
                <button onClick={() => handleDeleteTodo(todo.id)} className='todo_item_delete'>Delete</button>
            </div>
            ))}
        </div>
        </div>
    </div>
    );
};

export default Layout;
