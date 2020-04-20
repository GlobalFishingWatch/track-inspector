import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type Todo = {
  id: number
  text: string
  completed: boolean
}

const initialState: Todo[] = [
  {
    id: 0,
    text: 'hello',
    completed: false,
  },
]

let nextTodoId = 1

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: {
      reducer: (state, action: PayloadAction<{ id: number; text: string }>) => {
        const { id, text } = action.payload
        state.push({ id, text, completed: false })
      },
      prepare(text) {
        return { payload: { text, id: nextTodoId++ } }
      },
    },
    toggleTodo(state, action) {
      const todo = state.find((todo) => todo.id === action.payload)
      if (todo) {
        todo.completed = !todo.completed
      }
    },
  },
})

export const { addTodo, toggleTodo } = todosSlice.actions

export default todosSlice.reducer
