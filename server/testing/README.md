## **Running tests**
### Access Tests
Run ```node index.js``` within ```./db``` and ```./stripe``` respectively.
### Load Tests
Run ```jmeter -n -t plan.jmx -l results.csv -e```. Ensure that you have the jmeter CLI installed before execution.
### Store Tests
Run ```node index.js```.