const statusColor = (status) => {
  let color
  switch (status) {
    case `receive`:
      color = `#949494`
      break;

    case `tag`:
      color = `#3a2fa7`
      break;

    case `voucher`:
      color = `#7030A0`
      break;

    case `approve`:
      color = `#77933C`
      break;

    case `transmit`:
      color = `#31859D`
      break;

    case `create`:
    case `release`:
    case `reverse`:
      color = `#F79647`
      break;

    case `file`:
      color = `#B66837`
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