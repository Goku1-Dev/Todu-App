import { useState } from 'react';
import axios from 'axios';
import './index.scss';
import { useQuery } from '@tanstack/react-query';

const Layout = () => {
    const [todoList, setTodoList] = useState([]);
    const [newTodoName, setNewTodoName] = useState('');
    const [editIndex, setEditIndex] = useState(null);
    const [editTodoName, setEditTodoName] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [editMonth, setEditMonth] = useState('');

    const getData = useQuery({
        queryKey: ["users"],
        queryFn: apiGetCall,
    });

    async function apiGetCall(){
        const res = await axios.get('http://localhost:8000/user');
        setTodoList(res.data);
        return res.data;
    }

    if (getData.isLoading) {
        return "Loading...";
    }

    if (getData.error) {
        return "An error has occurred: " + getData.error.message;
    }


    // useEffect(() => {
    // const fetchUsers = async () => {
    //     try {
    //     const response = await axios.get('http://localhost:8000/user');
    //     setTodoList(response.data);
    //     } catch (error) {
    //     console.error('Error fetching users:', error);
    //     }
    // };
    // fetchUsers();
    // }, []);

    const handleAddTodo = async () => {
    if (!newTodoName.trim()) return;
    try {
        const response = await axios.post('http://localhost:8000/create', {
        name: newTodoName,
        month: selectedMonth,
        });
        setTodoList(prev => [...prev, response.data]);
        setNewTodoName('');
        setSelectedMonth('');
    } catch (error) {
        console.error('Error adding todo:', error);
    }
    };

    const startEdit = (index, currentName, currentMonth) => {
    setEditIndex(index);
    setEditTodoName(currentName);
    setEditMonth(currentMonth);
    };

    const handleEditTodo = async (id) => {
    if (!editTodoName.trim()) return;
    try {
        await axios.put(`http://localhost:8000/user/${id}`, {
        name: editTodoName,
        month: editMonth,
        });
        const updatedList = [...todoList];
        updatedList[editIndex] = { ...updatedList[editIndex], name: editTodoName, month: editMonth };
        setTodoList(updatedList);
        setEditIndex(null);
        setEditTodoName('');
        setEditMonth('');
    } catch (error) {
        console.error('Error editing todo:', error);
    }
    };

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
                    value={editIndex !== null ? editTodoName : newTodoName}
                    onChange={e => {
                        if (editIndex !== null) {
                            setEditTodoName(e.target.value);
                        } else {
                            setNewTodoName(e.target.value);
                        }
                    }}
                    placeholder='Enter todo name'
                />
            </div>
            <div className='layout_header_dropdown'>
                <select
                    className='month_dropdown'
                    value={editIndex !== null ? editMonth : selectedMonth}
                    onChange={e => {
                        if (editIndex !== null) {
                            setEditMonth(e.target.value);
                        } else {
                            setSelectedMonth(e.target.value);
                        }
                    }}
                >
                    <option value="">Select Month</option>
                    {Array.from({ length: 12 }, (_, index) => {
                        const monthName = new Date(0, index).toLocaleString('default', { month: 'long' });
                        return (
                            <option key={index} value={monthName}>
                                {monthName}
                            </option>
                        );
                    })}
                </select>
            </div>
            <button
                className='layout_add_button'
                onClick={() => {
                    if (editIndex !== null) {
                        handleEditTodo(todoList[editIndex].id);
                    } else {
                        handleAddTodo();
                    }
                }}
            >
                {editIndex !== null ? 'Update' : 'Add'}
            </button>
        </div>

        <div className='layout_body'>
            {todoList.map((todo, index) => (
            <div key={todo.id} className='todo_item'>
                    <div className='todo_item_name'>{index + 1}. {todo.name}</div>
                    <div className='todo_item_name'>{todo.month}</div>
                    <button onClick={() => startEdit(index, todo.name, todo.month)} className='todo_item_update'>Edit</button>
                <button onClick={() => handleDeleteTodo(todo.id)} className='todo_item_delete'>Delete</button>
            </div>
            ))}
        </div>
        </div>
    </div>
    );
};

export default Layout;
