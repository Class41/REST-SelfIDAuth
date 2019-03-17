# REST-SelfIDAuth

REST-SelfIDAuth designed for physical clients to be deployed, then connect and configure themselves automatically through the use of this REST interface.

## Interfaces

### /api/activated
***

```
/api/activated/{uuid}

GET - Returns requested client
PUT - Update IP of requested client (manually specified via JSON in body)
DELETE - Deactivates selected UUID
```


```
/api/activated/{uuid}/ip

PUT - Automatically detects and sets IP of requesting client
```


```
/api/activated/{uuid}/firmware

GET - Returns current firmware version + firmware URL
```


### /api/register
***

```
/api/register/{uuid}

PUT - Registers client from keyset with current IP
```
