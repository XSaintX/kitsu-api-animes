import * as request from 'request-promise';

import KitsuQueryBuilder = require('./kitsu-query-builder');
import KitsuResponse = require('./kitsu-response');
import Filter = require('./filter');

/**
* Author: Ji Heun Yoon (John)
* Wrapper to call Kitsu's JSON API easily
*/
class KitsuApi {
  private kitsuQueryBuilder: KitsuQueryBuilder;
  private headers = {
    'Accept': 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json'
  };

  /**
  * @Method Creates a kitsu query builder based on category.
  * @Param  The category you want to call to kitsu (e.g anime, category, chapters, etc)
            https://kitsu.docs.apiary.io/#reference includes all categorys you can query.
  * @Return The instance of the KitsuApi so you can method chain filters.
  */
  query(keyword: string): KitsuApi {
    this.kitsuQueryBuilder = new KitsuQueryBuilder(keyword);
    return this;
  }

  /**
  * @Method Sets the pagination offset when receiving data
            https://kitsu.docs.apiary.io/#introduction/json-api/pagination
  * @Param  The pagination offset  number
  * @Return The instance of the KitsuApi so you can method chain filters.
  */
  paginationOffset(offset: number): KitsuApi {
    this.kitsuQueryBuilder.addQueryParams(`page[offset]=${offset}`);
    return this;
  }

  /**
  * @Method Sets the pagination limit when receiving data
            https://kitsu.docs.apiary.io/#introduction/json-api/pagination
  * @Param  The pagination limit number
  * @Return The instance of the KitsuApi so you can method chain filters.
  */
  paginationLimit(limit: number): KitsuApi {
    this.kitsuQueryBuilder.addQueryParams(`page[limit]=${limit}`);
    return this;
  }

  /**
  * @Method Filter/Search method also you to pick attributes of an object of the query.
            (e.g The title from the ANIME query.)
            https://kitsu.docs.apiary.io/#introduction/json-api/filtering-and-search
  * @Param  The filter/object key and the filter/object value
  * @Return The instance of the KitsuApi so you can method chain filters.
  */
  filter(filterObjects: Filter[]): KitsuApi {
    filterObjects.forEach((filterObj: Filter) => {
      this.kitsuQueryBuilder.addQueryParams(`filter[${filterObj.key}]=${filterObj.value.join(',')}`);
    })
    return this;
  }

  /**
  * @Method Sorts based off flags given by kitsu. I haven't found all of them but some are specified in the documentation.
            https://kitsu.docs.apiary.io/#introduction/json-api/sorting
  * @Param  Array of flags for sorting.
  * @Return The instance of the KitsuApi so you can method chain filters.
  */
  sort(attributes: string[]): KitsuApi {
    attributes = attributes.map( a => {
      return KitsuQueryBuilder.DASH + a;
    });
    this.kitsuQueryBuilder.addQueryParams(`sort=${attributes.join(KitsuQueryBuilder.COMMA)}`);
    return this;
  }

  /**
  * @Method "You can include related resources with include=[relationship].
            You can also specify successive relationships using a .. A comma-delimited list can be used to request multiple relationships."
            https://kitsu.docs.apiary.io/#introduction/json-api/includes
  * @Param  Array of relationships.
  * @Return The instance of the KitsuApi so you can method chain filters.
  */
  includes(relationship: string[]): KitsuApi {
    this.kitsuQueryBuilder.addQueryParams(`includes=${relationship.join(KitsuQueryBuilder.COMMA)}`);
    return this;
  }

  /**
  * @Method "You can request a resource to only return a specific set of fields in its response. For example, to only receive a user's name and creation date:
            (e.g /users?fields[users]=name,createdAt)"
            https://kitsu.docs.apiary.io/#introduction/json-api/sparse-fieldsets
  * @Param  Array of field values.
  * @Return The instance of the KitsuApi so you can method chain filters.
  */
  sparse(fieldKey: string, fieldValues: string[]): KitsuApi {
    this.kitsuQueryBuilder.addQueryParams(`fields[${fieldKey}]=${fieldValues.join(KitsuQueryBuilder.COMMA)}`);
    return this;
  }

  /**
  * @Method Execution method for this wrapper API. You must call this to run the query/api call to kitsu!
  * @Param  N/A
  * @Return Promise of KitsuApiModel(Kitsu-Api response): { data: object[] }
  */
  async execute(): Promise<KitsuResponse> {
    return new Promise<KitsuResponse>((resolve, reject) => {
      const options = {
        uri: this.kitsuQueryBuilder.getURI(),
        headers: this.headers
      };
      request(options)
        .then((resp: KitsuResponse) => {
          return resolve(resp);
        })
        .catch(e => {
          return reject(e);
        })
    })
  }
}

export = KitsuApi;