const express = require('express');
const router = express.Router();
const Employee = require('../models/employee');

router.get('/employee/getAll', (req, res) => {
    Employee.find({})
        .then(allEmployees => {
            res.status(200).json({response: "SUCCESS", allEmployees: allEmployees});
        })
        .catch(
            error => console.log(error));
});

router.get('/employee/getById', (req, res) => {
    let userId = req.query.userId;
    if (!userId){
        res.status(400).json({error: "Missing user Id."});
    }
    else{
        Employee.findById(userId)
            .then(response => {
                console.log(response);
                res.status(200).json({response: "SUCCESS", employeeDetails: response});
            })
            .catch(anyError => {
                console.log(anyError);
                res.status(404).json({error: "There was some error.", exceptionMessage: anyError.stack});
            });
    }
});

router.get('/employee/getByCode', (req, res) => {
    let userEmployeeCode = req.query.employeeCode;
    if (!userEmployeeCode){
        res.status(400).json({error: "Missing employee code."});
    }
    else{
        Employee.findOne({code: userEmployeeCode.toUpperCase()})
            .then(response => {
                console.log(response);
                if(response == null){
                    response = `No employee found for code ${userEmployeeCode}.`;
                }
                res.status(200).json({response: "SUCCESS", employeeDetails: response});
            })
            .catch(error => {
                console.log(error);
            });
    }
});

router.post('/employee/createNew', (req, res) => {
    let errorTracker = [];
    let errorCount = 0;
    if (!req.body){
        res.status(400).json({error: "Employee details missing."});
    }
    let { employeeName, employeeDesignation, employeeSalary, employeeDepartment, employeeCode } = req.body;
    if (!employeeName){
        errorTracker.push("employeeName is a required field.");
        errorCount++;
    }
    if (!employeeDesignation){
        errorTracker.push("employeeDesignation is a required field.");
        errorCount++;
    }
    if (!employeeDepartment){
        errorTracker.push("employeeDepartment is a required field.");
        errorCount++;
    }
    if (!employeeCode){
        errorTracker.push("employeeCode is a required field.");
        errorCount++;
    }
    if (errorCount > 0){
        res.status(400).json({error: errorTracker});
    }
    else{
        let newEmployee = {
            name: employeeName,
            designation: employeeDesignation.toUpperCase(),
            salary: employeeSalary ? employeeSalary: 10000,
            department: employeeDepartment.toUpperCase(),
            code: employeeCode.toUpperCase()
        }
        Employee.create(newEmployee)
            .then(emp => { 
                console.log(emp);
                res.status(201).json({ response: "SUCCESS", employeeDetails:emp});
            })
            .catch(error => {
                console.log(error);
                res.status(500).json({error: "Something went wrong."});
            });
    }
});


module.exports = router;
