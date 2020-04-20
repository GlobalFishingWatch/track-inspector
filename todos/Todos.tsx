import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleTodo, Todo } from './todos.slice'
import { selectTodos } from './todos.selectors'

const Todos = () => {
  const todos: Todo[] = useSelector(selectTodos)
  const dispatch = useDispatch()
  return (
    <div>
      {todos.map((todo) => {
        return (
          <div
            onClick={() => dispatch(toggleTodo(todo.id))}
            key={todo.id}
            style={{ fontWeight: todo.completed ? 'bold' : 'normal' }}
          >
            {todo.text}
          </div>
        )
      })}
    </div>
  )
}

export default Todos
