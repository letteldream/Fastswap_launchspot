const express = require('express')

const router = express.Router()
const { ethers } = require('hardhat')
// const web3 = require('web3')
// require("dotenv").config();

const Project = require('../models/Project')

const deploy = async (params) => {
    // console.log(params)
    const IDOPool = await ethers.getContractFactory('IDOPool')
    const idoPool = await IDOPool.deploy(
        params.open,
        params.close,
        params.tokenAddress,
        params.swapRate,
        params.softcap,
        params.hardcap,
        {
            gasLimit: 4000000
        }
    )
    await idoPool.deployed()
    return idoPool.address
}

router.get('/projects', (req, res) => {
    Project.find((err, data) => {
        if (err) return res.json({ success: false })
        return res.json({ success: true, projectData: data })

    })
})

router.post('/project', (req, res) => {
    const newProject = Project(req.body)
    newProject.save(function (err, added) {
        if (err) console.log(err)
        else {
            res.json({ success: true, added })
        }
    })
})

router.post('/doUpdateProject/:where', (req, res) => {

    const query = { ...req.body }
    console.log('query', query);

    Project.findById(req.params.where, async function (err, project) {
        if (err) console.log(err)
        else {
            Project.findByIdAndUpdate(req.params.where, query, function (err, update) {
                if (err) res.json({ err })
                else res.json({ success: true, update })
            });
        }
    })
})

router.post('/delete/:where', (req, res) => {
    Project.findOneAndRemove({ _id: req.params.where }, req.body, function (err, removed) {
        if (err) console.log(err)
        else {
            res.json({ success: true })
        }
    })
})

router.post('/publish/:where', async (req, res) => {
    if (req.params.where !== 'direct') {
        Project.findById(req.params.where, async function (err, project) {
            if (err) console.log(err)
            else {
                let contractAddress;
                if (!project.contractAddress) {
                    console.log('Contract deploying')
                    contractAddress = await deploy(req.body)
                    console.log('IDOPool contract deployed to address:', contractAddress)
                    const query = { contractAddress: contractAddress }
                    Project.findOneAndUpdate({ _id: req.params.where }, query, function (err, updated) {
                        if (err) console.log(err)
                        // else console.log(updated)
                    })
                } else {
                    contractAddress = project.contractAddress
                }
                const poolContract = await ethers.getContractFactory('IDOPool')
                const contract = await poolContract.attach(contractAddress)
                // if (req.body.addressList.length > 0) {
                //     console.log('Adding addresslist')
                //     const response = await contract.addWhitelists(req.body.addressList).catch((err) => {
                //         console.log('res', err)
                //         res.json({ err })
                //     })
                //     await response.wait()
                //     console.log('Addresslist added')
                // }
                // if (req.body.fastAmount.length > 0) {
                //     console.log('Setting Tier Fast Limit')
                //     const response = await contract.setTierFastLimit(req.body.fastAmount).catch((err) => {
                //         console.log('res', err)
                //         res.json({ err })
                //     })
                //     await response.wait()
                //     console.log('Tier Fast Limit setted')
                // }
                // if (req.body.dukeAmount.length > 0) {
                //     console.log('Setting Tier Duke Limit')
                //     const response = await contract.setTierDukeLimit(req.body.dukeAmount).catch((err) => {
                //         console.log('res', err)
                //         res.json({ err })
                //     })
                //     await reponse.wait()
                //     console.log('Tier Duke Limit setted')
                // }
                console.log('Successfully Initialized')
                const query = { visibility: 'Published' }
                Project.findOneAndUpdate({ _id: req.params.where }, query, function (err, updated) {
                    if (err) console.log(err)
                    res.json({ success: true, updated })
                })
            }
        })
    }
    else {
        const newProject = Project(req.body)
        // console.log('req.body', req.body);
        const contractAddress = await deploy(req.body)
        console.log('contractAddress', contractAddress)
        newProject.contractAddress = contractAddress
        newProject.visibility = 'Published'
        newProject.save(function (err, added) {
            if (err) console.log(err)
            else {
                res.json({ success: true, added })
            }
        })
    }
})

module.exports = router