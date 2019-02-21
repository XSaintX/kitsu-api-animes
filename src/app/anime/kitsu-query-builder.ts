/**
* Author: Ji Heun Yoon (John)
* Builds the URI end point to query Kitsu's JSON API
*/
class KitsuQueryBuilder {
    private URI = 'https://kitsu.io/api/edge';
    private extraParams: boolean = false;
    static COMMA: string = ',';
    static DASH:string = '-';
    static WHITESPACE: string = " ";
    static SPACE:string = '%20';
  
    /**
    * @Constructor Creates an instance of URI you want to build to call Kitsu API
    * @Param The category you want to query. Check KitsuApi.query method for documentation on "category"
    */
    constructor(category: string) {
      this.URI += `/${category.replace(KitsuQueryBuilder.WHITESPACE, KitsuQueryBuilder.SPACE)}?`;
    }
  
    /**
    * @Method Adds query parameters to URI to call Kitsu JSON API
    * @Param Takes in a string to append at end of URI to format query params
    * @Return void
    */
    addQueryParams(params: string): void {
      if(this.extraParams) this.URI += `&${params}`;
      else {
        this.URI += `${params}`;
        this.extraParams = true;
      }
    }
    /**
    * @Method Getter for URI
    * @Param N/A
    * @Return String version of URI
    */
    getURI(): string {
      return this.URI;
    }
  }
  
  export = KitsuQueryBuilder;