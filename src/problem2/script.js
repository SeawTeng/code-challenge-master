let prices = []
let previousSend = ''
let previousReceive = ''

async function getPrices() {
  try {
    const res = await fetch('https://interview.switcheo.com/prices.json')

    if (res) {
      const tempData = await res.json()
      const dataMap = new Map()
      tempData.forEach((curr) => dataMap.set(curr.currency, curr))
      this.prices = dataMap

      return dataMap
    }
  } catch (error) {
    console.log(error)
  }
}

async function displayDropdown() {
  const dataMap = await getPrices()

  const list1 = document.getElementById('currencyList-1')
  const dd1 = document.getElementById('dropdown1')

  const list2 = document.getElementById('currencyList-2')
  const dd2 = document.getElementById('dropdown2')

  dataMap.values().forEach((c) => {
    if (dd1.innerHTML == '') {
      dd1.innerHTML = `<img width="20px" src="./tokens/${c.currency}.svg" alt="currency"> ${c.currency}`
      this.previousSend = c.currency
    }

    const li = document.createElement('li')
    li.innerHTML = `<a class="dropdown-item" href="#"><img width="20px" src="./tokens/${c.currency}.svg" alt="currency">${c.currency}</a>`

    li.addEventListener('click', (event) => {
      event.preventDefault()

      if (c.currency === this.previousReceive) {
        dd1.value = this.previousSend

        Swal.fire({
          icon: 'error',
          text: 'Send and Receive cannot be in same currency',
        })

        return
      }
      dd1.innerHTML = `<img width="20px" src="./tokens/${c.currency}.svg" alt="currency"> ${c.currency}`

      this.previousSend = c.currency
      compute(document.getElementById('input-amount-1').value, 'dropdown1')
    })

    list1.appendChild(li)

    const li2 = document.createElement('li')
    li2.innerHTML = `<a class="dropdown-item" href="#"><img width="20px" src="./tokens/${c.currency}.svg" alt="currency">${c.currency}</a>`

    li2.addEventListener('click', (event) => {
      event.preventDefault()

      if (c.currency === this.previousSend) {
        dd2.value = this.previousReceive

        Swal.fire({
          icon: 'error',
          text: 'Send and Receive cannot be in same currency',
        })

        return
      }

      dd2.innerHTML = `<img width="20px" src="./tokens/${c.currency}.svg" alt="currency"> ${c.currency}`

      this.previousReceive = c.currency
      compute(0, 'dropdown2')
    })

    list2.appendChild(li2)
  })
}

function compute(value, name) {
  const input1 = document.getElementById('input-amount-1')
  const input2 = document.getElementById('input-amount-2')

  const output1 = document.getElementById('calculate1')
  const output2 = document.getElementById('calculate2')

  const currency1 = document.getElementById('dropdown1').innerText.trim()
  const currency2 = document.getElementById('dropdown2').innerText.trim()

  if (name == 'dropdown2' && currency2 == 'SELECT TOKEN') {
    input2.value = 0
    return
  }

  const rate1 = this.prices.get(currency1)?.price || 1
  const rate2 = this.prices.get(currency2)?.price || 1

  if (name == 'dropdown1') {
    output1.innerText = Number(value) * rate1

    if (currency2 != 'SELECT TOKEN') {
      input2.value = (Number(output1.innerText) / rate2).toFixed(3)
      output2.innerText = Number(input2.value) * rate2
    }
  } else {
    if (value == 0 && Number(input1.value) != 0) {
      input2.value = (Number(output1.innerText) / rate2).toFixed(3)
      output2.innerText = Number(input2.value) * rate2
    } else if (value != 0) {
      output2.innerText = Number(value) * rate2
      input1.value = (Number(output2.innerText) / rate1).toFixed(3)
      output1.innerText = Number(input1.value) * rate1
    }
  }
}

displayDropdown()

function submitSwap() {
  event.preventDefault()

  const input1 = document.getElementById('input-amount-1')
  const input2 = document.getElementById('input-amount-2')
  const dd2 = document.getElementById('dropdown2')
  if (
    Number(input1.value) > 0 &&
    Number(input2.value) > 0 &&
    dd2.innerText.trim() != 'SELECT TOKEN'
  ) {
    Swal.fire({
      icon: 'success',
      text: 'Amount have successfully swap!',
    })

    input1.value = 0
    compute(0, 'dropdown1')
    dd2.innerHTML = 'SELECT TOKEN'
  } else {
    Swal.fire({
      icon: 'error',
      text: 'Please check that you have selected the correct currency and input the amount!',
    })
  }
}
