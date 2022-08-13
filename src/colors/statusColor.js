const statusColor = (status) => {
  let color
  switch (status) {
    case `tag`:
      color = `#3a2fa7`
      break;

    case `receive`:
      color = `#949494`
      break;

    case `hold`:
    case `return`:
    case `void`:
      color = `#ff5252`
      break;

    default:
      color = `#ed6c02`
  }

  return color
}

export default statusColor