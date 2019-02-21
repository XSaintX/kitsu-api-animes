## Kitsu JSON API

This is a wrapper for the JSON API provided by Kitsu for Node.js.
Full documentation can be found on their [website](https://kitsu.docs.apiary.io/#introduction/json-api).

## How to get started

Install with NPM
```
npm i kitsu-json-api --save
```
Import module to your js file
```javascript
import KitsuApi from 'kitsu-json-api';
```
or
```javascript
const KitsuApi =  require('kitsu-json-api');
```
then
```javascript
let kitsuApi =  new KitsuApi();
```

## Methods/Functions

#### execute()
 Execution method for this wrapper API. You must call this to run the query/api call to kitsu!
 This method will return a promise with the response from kitsu.
 Kitsu response is modeled as
```javascript
 {
   data: [{
      // object attributes
     }]
 }
 ```
#### query(keyword)
 First method you need to call to properly call the API. The query function takes in a parameter that is a category the API allows you to query. For example if you want to query for animes you would do
 ```javascript
  kitsuApi.query('anime')
 ```
  Check [here](https://kitsu.docs.apiary.io/#reference) to see which categories you can query.
#### paginationOffset(number)
  Sets the [offset for pagination](https://kitsu.docs.apiary.io/#introduction/json-api/pagination) when receiving data.
#### paginationLimit(number)
  Sets the [limit for pagination](https://kitsu.docs.apiary.io/#introduction/json-api/pagination) when receiving data.
#### filter({Array.<{ filterKey: string, filterValue: string[], }>})
  Allows you to [filter the category you](https://kitsu.docs.apiary.io/#introduction/json-api/filtering-and-search] query based on attributes of that category.) [Check here](https://kitsu.docs.apiary.io/#reference) to find what attributes the category has.
#### sort([ attributes ])
  This methods takes in an array of flags and
  [sorts based off the flags](https://kitsu.docs.apiary.io/#introduction/json-api/sorting) given by Kitsu. I haven't found all of them but some are specified in the documentation.
#### includes([ relationships ])
"You can include related resources with include=[relationship].
          You can also specify successive relationships using a .. A comma-delimited list can be used to [request multiple relationships](https://kitsu.docs.apiary.io/#introduction/json-api/includes)."

#### sparse(fieldKey, [ fieldValues ])
"You can request a resource to only return a [specific set of fields in its response](https://kitsu.docs.apiary.io/#introduction/json-api/sparse-fieldsets). For example, to only receive a user's name and creation date:
          (e.g /users?fields[users]=name,createdAt)"

## Example

#### Async/Await
```javascript
  let resp = await kitsuApi
    .query('anime') // anime category
    .filter([
      {
        key: 'season',
        value: ['winter', 'spring'] // filter by winter and spring
      },
      {
        key: 'seasonYear',  // filter by year 2017
        value: ['2017']
      }
    ])
    .paginationLimit(10) // set limit
    .paginationOffset(2) // set offset
    .sort(['followersCount', 'followingCount']) // sort by follower count and following count
    .execute(); // execute the query
```
or

#### Promises
```javascript
kitsuApi
  .query('anime') // anime category
  .filter([
    {
      key: 'season',
      value: ['winter', 'spring'] // filter by winter and spring
    },
    {
      key: 'seasonYear', // filter by year 2017
      value: ['2017']
    }
  ])
  .paginationLimit(10) // set limit
  .paginationOffset(2) // set offset
  .sort(['followersCount', 'followingCount']) // sort by follower count and following count
  .execute().then(resp => {
    // do something with json
  });
```
