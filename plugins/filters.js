import Vue from 'vue'

Vue.filter('truncate', (text = '', length, clamp = '...') => {
  const content = text ? text.toString() : ''

  if (clamp === 'start') {
    return content.length > length
      ? content.slice(0, length - 4) + '...'
      : content
  } else {
    return content.length > length
      ? content.slice(0, length - 4) +
          clamp +
          content.slice(content.length - 4, content.length)
      : content
  }
})
