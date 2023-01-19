import { byQuery } from './utils/dom_utils.js'
import { captureTodo, renderTodo, sortTodo } from './utils/todo_utils.js'
import { makeHttpRequest } from './utils/dom_utils.js'
const ready = async () => {
  try {
    byQuery('.form-submit-btn').addEventListener('click', (e) => {
      e.preventDefault()
      captureTodo()
    })
    byQuery('.sort-btn').addEventListener('click', (e) => {
      return sortTodo(e.target.getAttribute('data-sort-type'))
    })
    await renderTodo()
  } catch (e) {
    console.log(e.message)
  }
}

document.addEventListener('DOMContentLoaded', ready)
