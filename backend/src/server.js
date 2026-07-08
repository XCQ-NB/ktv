const fs = require('fs')
const path = require('path')
const express = require('express')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3000
const DATA_FILE = path.join(__dirname, '..', 'data', 'store.json')

app.use(cors())
app.use(express.json())

function readStore() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
}

function writeStore(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8')
}

function formatNumber(num) {
  return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function authMiddleware(req, res, next) {
  const token = req.headers.authorization || ''
  if (!token.startsWith('Bearer mock_token_')) {
    return res.status(401).json({ message: '未登录或 token 无效' })
  }
  next()
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: Date.now() })
})

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ message: '用户名和密码必填' })
  }

  const store = readStore()
  const user = store.users.find(
    (item) =>
      (item.username === username || item.phone === username) &&
      item.password === password
  )

  if (!user) {
    return res.status(401).json({ message: '账号或密码错误' })
  }

  return res.json({
    token: `mock_token_${Date.now()}`,
    userInfo: user
  })
})

app.post('/api/auth/register', (req, res) => {
  const { realName, stageName, phone, idNumber, entryDate, avatarUrl } = req.body
  if (!realName || !stageName || !phone || !idNumber) {
    return res.status(400).json({ message: '缺少必填字段' })
  }
  if (!/^1\d{10}$/.test(phone)) {
    return res.status(400).json({ message: '手机号格式不正确' })
  }
  if (!/^\d{17}[\dXx]$/.test(idNumber)) {
    return res.status(400).json({ message: '身份证号格式不正确' })
  }

  const store = readStore()
  if (store.users.some((user) => user.phone === phone)) {
    return res.status(409).json({ message: '手机号已注册' })
  }

  const user = {
    id: store.users.length ? Math.max(...store.users.map((u) => u.id)) + 1 : 1,
    username: phone,
    password: '123456',
    realName,
    stageName,
    phone,
    avatar: avatarUrl || '',
    monthlySoundwave: 0,
    monthlySessions: 0,
    monthlyTaskRemaining: 250000,
    holidayBalance: 0,
    yesterdaySoundwave: 0,
    todaySoundwave: 0,
    monthSoundwave: 0,
    monthTaskTarget: 250000,
    monthTaskProgress: 0
  }
  store.users.push(user)
  writeStore(store)

  res.json({
    message: '注册申请已提交，等待管理员审核',
    userId: user.id
  })
})

app.get('/api/home', authMiddleware, (req, res) => {
  const store = readStore()
  const user = store.users[0]
  const dailyChannels = [
    { id: 'checkin', name: '音浪打卡', icon: '/assets/icons/3d/note.png' },
    { id: 'schedule', name: '直播间排班', icon: '/assets/icons/3d/screen.png' },
    { id: 'leave', name: '请假', icon: '/assets/icons/3d/clipboard.png' },
    { id: 'task', name: '本月任务', icon: '/assets/icons/3d/task.png' }
  ]

  res.json({
    user,
    dailyChannels,
    ranking: store.ranking
  })
})

app.get('/api/dashboard', authMiddleware, (req, res) => {
  const { period = 'today' } = req.query
  const store = readStore()

  const dataMap = {
    today: [
      { label: '我的音浪', value: '0' },
      { label: '开播场次', value: '0' },
      { label: '场均音浪', value: '0' },
      { label: '排名', value: '第-名', highlight: true }
    ],
    yesterday: [
      { label: '我的音浪', value: '9,852' },
      { label: '开播场次', value: '2' },
      { label: '场均音浪', value: '4,926' },
      { label: '排名', value: '第2名', highlight: true }
    ],
    week: [
      { label: '我的音浪', value: '45,230' },
      { label: '开播场次', value: '12' },
      { label: '场均音浪', value: '3,769' },
      { label: '排名', value: '第3名', highlight: true }
    ],
    month: [
      { label: '我的音浪', value: '20,384' },
      { label: '开播场次', value: '47' },
      { label: '场均音浪', value: '433' },
      { label: '排名', value: '第2名', highlight: true }
    ],
    all: [
      { label: '我的音浪', value: '1,234,567' },
      { label: '开播场次', value: '320' },
      { label: '场均音浪', value: '3,858' },
      { label: '排名', value: '第5名', highlight: true }
    ]
  }

  res.json({
    period,
    topStreamers: store.topStreamers,
    myData: dataMap[period] || dataMap.today
  })
})

app.get('/api/profile', authMiddleware, (req, res) => {
  const store = readStore()
  const user = store.users[0]
  const menus = [
    { id: 'overview', name: '数据总览', icon: '/assets/icons/3d/bars.png', url: '/pages/dashboard/dashboard' },
    { id: 'leave', name: '请假', icon: '/assets/icons/3d/clipboard.png', url: '/pages/leave/leave' },
    { id: 'task', name: '音浪任务', icon: '/assets/icons/3d/task.png', url: '/pages/task/task' },
    { id: 'notice', name: '公告通知', icon: '/assets/icons/3d/bell.png', url: '/pages/notice/notice' }
  ]

  res.json({
    user,
    dataCards: [
      { label: '本月音浪', value: formatNumber(user.monthlySoundwave) },
      { label: '本月场次', value: String(user.monthlySessions) },
      { label: '本月任务剩余', value: formatNumber(user.monthlyTaskRemaining) },
      { label: '假期余额', value: String(user.holidayBalance) }
    ],
    menus
  })
})

app.get('/api/leave', authMiddleware, (req, res) => {
  const store = readStore()
  res.json({ records: store.leaveRecords })
})

app.post('/api/leave', authMiddleware, (req, res) => {
  const { type, startDate, endDate, reason } = req.body
  if (!type || !startDate || !endDate || !reason) {
    return res.status(400).json({ message: '参数不完整' })
  }

  const store = readStore()
  const record = {
    id: store.leaveRecords.length ? Math.max(...store.leaveRecords.map((r) => r.id)) + 1 : 1,
    userId: 1,
    type,
    startDate,
    endDate,
    reason,
    statusText: '审批中',
    statusClass: 'pending'
  }
  store.leaveRecords.unshift(record)
  writeStore(store)

  res.json({ message: '申请已提交', record })
})

app.get('/api/notice', authMiddleware, (req, res) => {
  const store = readStore()
  res.json({ notices: store.notices })
})

app.get('/api/task', authMiddleware, (req, res) => {
  const store = readStore()
  const user = store.users[0]
  res.json({
    progress: user.monthTaskProgress,
    current: formatNumber(user.monthSoundwave),
    target: formatNumber(user.monthTaskTarget),
    remaining: formatNumber(user.monthTaskTarget - user.monthSoundwave),
    dailyTasks: [
      { day: 1, weekday: '二', amount: '9,852', percent: 98, done: true },
      { day: 2, weekday: '三', amount: '8,230', percent: 82, done: true },
      { day: 3, weekday: '四', amount: '7,650', percent: 76, done: true },
      { day: 4, weekday: '五', amount: '9,100', percent: 91, done: true },
      { day: 5, weekday: '六', amount: '6,800', percent: 68, done: true }
    ]
  })
})

app.get('/api/schedule', authMiddleware, (req, res) => {
  res.json({
    weekText: '7月8日 - 7月14日',
    weekDays: [
      { name: '一', date: 8, isToday: true },
      { name: '二', date: 9, isToday: false },
      { name: '三', date: 10, isToday: false },
      { name: '四', date: 11, isToday: false },
      { name: '五', date: 12, isToday: false },
      { name: '六', date: 13, isToday: false },
      { name: '日', date: 14, isToday: false }
    ]
  })
})

app.post('/api/checkin', authMiddleware, (req, res) => {
  const { soundwave } = req.body
  if (!soundwave || Number(soundwave) <= 0) {
    return res.status(400).json({ message: '音浪数必须大于 0' })
  }

  const store = readStore()
  const now = new Date()
  const record = {
    id: store.checkins.length ? Math.max(...store.checkins.map((r) => r.id)) + 1 : 1,
    userId: 1,
    soundwave: Number(soundwave),
    time: now.toISOString()
  }

  store.checkins.unshift(record)
  const user = store.users[0]
  user.todaySoundwave = Number(soundwave)
  user.monthSoundwave += Number(soundwave)
  user.monthTaskProgress = Math.floor((user.monthSoundwave / user.monthTaskTarget) * 100)
  writeStore(store)

  res.json({ message: '打卡成功', record })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend service running at http://0.0.0.0:${PORT}`)
})
