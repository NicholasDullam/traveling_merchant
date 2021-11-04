const schedule = require('node-schedule')
const jobs = {} // jobs are to be added with a key of their associated id

const addJob = (id, time, task) => {
    let date = new Date(time)
    jobs[id] = schedule.scheduleJob(`${date.getHours()} ${date.getDate()} ${date.getMonth() + 1} ${date.getDay()}`, task)
    console.log(jobs[id])
}

const removeJob = (id) => {
    let job = jobs[id]
    if (job) job.cancel()
    delete jobs[id]
}

module.exports = {
    addJob,
    removeJob
}