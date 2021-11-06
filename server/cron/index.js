const schedule = require('node-schedule')
const jobs = {} // jobs are to be added with a key of their associated id

const addJob = (id, time, task) => {
    jobs[id] = schedule.scheduleJob(new Date(time), task)
    return jobs[id]
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