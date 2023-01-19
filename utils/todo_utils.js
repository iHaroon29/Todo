import { byId, byQuery, makeId, returnLength } from './dom_utils.js'

const captureTodo = async () => {
  try {
    const todoInput = byId('todoInput').value
    if (!todoInput) throw new Error('Invalid Todo Input')
    const todoPriority = [...byId('todoPriority').selectedOptions][0]
    const todoMeta = {
      value: todoPriority.getAttribute('value'),
      level: todoPriority.getAttribute('data-priority'),
      uniqueId: await makeId(10),
      date: new Date(),
      isCompleted: false,
    }
    let existingData = JSON.parse(localStorage.getItem('todo-list'))
    if (existingData == null) {
      existingData = []
    }
    existingData.push({ todoInput, todoMeta })
    localStorage.setItem('todo-list', JSON.stringify(existingData))
    byId('todoInput').value = ''
    await renderTodo()
  } catch (e) {
    alert(e.message)
  }
}

const renderTodo = async () => {
  try {
    const tasksHolderUF = byQuery('.tasks-holder')
    const tasksHolderF = byQuery('.tasks-holder-f')
    if (tasksHolderF.children.length !== 0) {
      let tasksHolderFChildren = [...tasksHolderF.children]
      tasksHolderFChildren.forEach((child) => tasksHolderF.removeChild(child))
    }
    if (tasksHolderUF.children.length !== 0) {
      let tasksHolderUFChildren = [...tasksHolderUF.children]
      tasksHolderUFChildren.forEach((child) => tasksHolderUF.removeChild(child))
    }
    let existingTasks = JSON.parse(localStorage.getItem('todo-list'))
    if (existingTasks == null) return
    existingTasks.forEach((node) => {
      const todoWrapper = document.createElement('div')
      todoWrapper.classList.add('task-holder')
      todoWrapper.setAttribute('data-unique-id', node.todoMeta.uniqueId)
      todoWrapper.setAttribute('data-click-event', false)
      todoWrapper.setAttribute('data-mouse-event', false)
      todoWrapper.setAttribute('data-priority', node.todoMeta.level)
      todoWrapper.innerHTML = `
      <div class="todo-text-holder">
      <p class="todo-wrapper-text">${node.todoInput}</p>
            <div class="animate-div animate-up-bottom"></div>
      </div>

      <div class="todo-btn-holder">
      <button class="todo-delete-btn" id="todoDeleteBtn" data-click-event="false">delete</button>
      </div>`
      node.todoMeta.isCompleted === false
        ? tasksHolderUF.appendChild(todoWrapper)
        : tasksHolderF.appendChild(todoWrapper)
    })
    await listenerRefresh()
  } catch (e) {
    console.log(e.message)
  }
}

const sortTodo = async (type) => {
  try {
    let data = JSON.parse(localStorage.getItem('todo-list'))
    const sortSpan = byQuery('.priority-type')
    const sortBtn = byQuery('.sort-btn')
    if (!data) throw new Error('Local Storage empty')
    const sortedArray = data.sort((a, b) => {
      if (type === 'high')
        return parseInt(a.todoMeta.level) - parseInt(b.todoMeta.level)
      return parseInt(b.todoMeta.level) - parseInt(a.todoMeta.level)
    })
    type === 'high'
      ? sortBtn.setAttribute('data-sort-type', 'low')
      : sortBtn.setAttribute('data-sort-type', 'high')
    type === 'high'
      ? (sortSpan.innerText = 'Low')
      : (sortSpan.innerText = 'High')
    localStorage.setItem('todo-list', JSON.stringify(sortedArray))
    await renderTodo()
  } catch (e) {
    alert(e.message)
  }
}

const updateTodo = async (target) => {
  try {
    const parentElement = target.parentElement
    const existingTodos = JSON.parse(localStorage.getItem('todo-list'))
    const todoUniqueId = parentElement.getAttribute('data-unique-id')
    for (let todo of existingTodos) {
      if (
        todo.todoMeta.uniqueId === todoUniqueId &&
        todo.todoMeta.isCompleted === false
      ) {
        todo.todoMeta.isCompleted = true
        localStorage.setItem('todo-list', JSON.stringify(existingTodos))
        break
      } else if (
        todo.todoMeta.uniqueId === todoUniqueId &&
        todo.todoMeta.isCompleted === true
      ) {
        todo.todoMeta.isCompleted = false
        localStorage.setItem('todo-list', JSON.stringify(existingTodos))
        break
      }
    }
    await renderTodo()
  } catch (e) {
    console.log(e.message)
  }
}

const deleteTodo = async (target) => {
  try {
    const parentTarget = target.parentElement
    const existingTodos = JSON.parse(localStorage.getItem('todo-list'))
    const todoUniqueId = parentTarget.getAttribute('data-unique-id')
    const updatedTodos = existingTodos.filter(
      (node) => node.todoMeta.uniqueId !== todoUniqueId
    )
    localStorage.setItem('todo-list', JSON.stringify(updatedTodos))
    await renderTodo()
  } catch (e) {
    console.log(e.message)
  }
}

const listenerRefresh = async () => {
  try {
    const deleteBtns = [...byQuery('.todo-delete-btn', true)]
    const todoHolder = [...byQuery('.task-holder', true)]
    todoHolder.forEach((todo) => {
      const todoTextHolder = [...todo.children][0]
      if (todo.getAttribute('data-click-event') === 'false') {
        todo.addEventListener(
          'click',
          (e) => updateTodo(e.target.parentElement),
          true
        )
        todo.setAttribute('data-click-event', true)
      }
      if (todo.getAttribute('data-mouse-event') === 'false') {
        todoTextHolder.addEventListener('mouseenter', (e) => {
          const animationDiv = [...todoTextHolder.children][1]
          animationDiv.classList.replace(
            'animate-up-bottom',
            'animate-bottom-up'
          )
        })
        todoTextHolder.addEventListener('mouseleave', (e) => {
          const animationDiv = [...todoTextHolder.children][1]
          animationDiv.classList.replace(
            'animate-bottom-up',
            'animate-up-bottom'
          )
        })
        todo.setAttribute('data-mouse-event', true)
      }
    })
    deleteBtns.forEach((btn) => {
      if (btn.getAttribute('data-click-event') === 'false') {
        btn.addEventListener('click', (e) => deleteTodo(e.target.parentElement))
        btn.setAttribute('data-click-event', 'true')
      }
    })
    if (!todoHolder) return
  } catch (e) {
    console.log(e.message)
  }
}

export { captureTodo, deleteTodo, renderTodo, sortTodo, listenerRefresh }
