import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import User from '../models/User.js'
import Contract from '../models/Contract.js'
import Activity from '../models/Activity.js'

const { MONGO_URI='mongodb://localhost:27017/contractmanager', ADMIN_NAME='Admin', ADMIN_EMAIL='admin@example.com', ADMIN_PASSWORD='password' } = process.env

async function main(){
  await mongoose.connect(MONGO_URI, { autoIndex: true })
  let admin = await User.findOne({ email: ADMIN_EMAIL })
  if (!admin){
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10)
    admin = await User.create({ name: ADMIN_NAME, email: ADMIN_EMAIL, role: 'Admin', passwordHash })
    await Activity.create({ type:'user.seed.create', description:`Seeded admin ${ADMIN_EMAIL}`, actor: admin._id })
  }
  let existing = await Contract.findOne({ contractId: 'CNT-001' })
  if (!existing){
    const start = new Date()
    const end = new Date(Date.now()+1000*60*60*24*60)
    const contract = await Contract.create({
      contractId:'CNT-001', title:'Sample Contract', description:'Seeded sample contract for onboarding',
      startDate:start, endDate:end, totalValue:25000, status:'active',
      provider:{ name:'Vendor Inc', contact:{ email:'vendor@example.com', phone:'+1-555-0100', address:'Main St' }, projectManager:{ name:'Vendor PM', email:'vpm@example.com', role:'PM' } },
      client:{ company:'Client LLC', projectManager:{ name:'Client PM', email:'cpm@example.com', role:'PM' } },
      milestones:[
        { title:'Milestone 1', amount:10000, dueDate:new Date(Date.now()+1000*60*60*24*7), status:'pending' },
        { title:'Milestone 2', amount:10000, dueDate:new Date(Date.now()+1000*60*60*24*30), status:'pending' },
        { title:'Final', amount:5000, dueDate:new Date(Date.now()+1000*60*60*24*55), status:'pending' }
      ],
      documents:[], owner:admin._id, assignedUsers:[]
    })
    await Activity.create({ type:'contract.seed.create', description:`Seeded contract ${contract.title}`, actor: admin._id, contract: contract._id })
  }
  await mongoose.disconnect()
  console.log('Seed complete. Login with', ADMIN_EMAIL, '/', ADMIN_PASSWORD)
}
main().catch(e=>{ console.error(e); process.exit(1) })