 (function() {
     //@exclude
     'use strict';
     /*globals corbel */
     //@endexclude

     /**
      * Relation
      * @class
      * @memberOf Resources
      * @param  {String} srcType     The source resource type
      * @param  {String} srcId       The source resource id
      * @param  {String} destType    The destination resource type
      */
     corbel.Resources.Relation = corbel.Resources.BaseResource.inherit({

         constructor: function(srcType, srcId, destType, driver, params) {
             this.type = srcType;
             this.srcId = srcId;
             this.destType = destType;
             corbel.validate.values(['type', 'srcId', 'destType'],this);
             this.driver = driver;
             this.params = params || {};
         },

         /**
          * Gets the resources of a relation
          * @method
          * @memberOf Resources.Relation
          * @param  {String} dataType    Mime type of the expected resource
          * @param  {String} destId         Relationed resource
          * @param  {Object} params      Params of the corbel request
          * @return {Promise}            ES6 promise that resolves to a relation {Object} or rejects with a {@link CorbelError}
          * @see {@link corbel.util.serializeParams} to see a example of the params
          */
         get: function(destId, options) {
          options = this.getDefaultOptions(options);
          var args = corbel.utils.extend(options, {
              url: this.buildUri(this.type, this.srcId, this.destType, destId),
              method: corbel.request.method.GET,
              Accept: options.dataType
          });

          return this.request(args);
         },

         /**
          * Adds a new relation between Resources
          * @method
          * @memberOf Resources.Relation
          * @param  {String} destId          Relationed resource
          * @param  {Object} relationData Additional data to be added to the relation (in json)
          * @return {Promise}             ES6 promise that resolves to undefined (void) or rejects with a {@link CorbelError}
          * @example uri = '555'
          */
         add: function(destId, relationData, options) {
          options = this.getDefaultOptions(options);
          corbel.validate.value('destId', destId);

          var args = corbel.utils.extend(options, {
            url: this.buildUri(this.type, this.srcId, this.destType, destId),
            data: relationData,
            method: corbel.request.method.PUT,
            contentType: options.dataType,
            Accept: options.dataType
          });

          return this.request(args);
         },

          /**
           * Adds a new anonymous relation
           * @method
           * @memberOf Resources.Relation
           * @param  {Object} relationData Additional data to be added to the relation (in json)
           * @return {Promise}             ES6 promise that resolves to undefined (void) or rejects with a {@link CorbelError}
           * @example uri = '555'
           */
          addAnonymous: function(relationData, options) {
            options = this.getDefaultOptions(options);

            var args = corbel.utils.extend(options, {
              url: this.buildUri(this.type, this.srcId, this.destType),
              data: relationData,
              method: corbel.request.method.POST,
              contentType: options.dataType,
              Accept: options.dataType
            });

            return this.request(args);
          },

         /**
          * Move a relation
          * @method
          * @memberOf Resources.Relation
          * @param  {Integer} pos          The new position
          * @return {Promise}              ES6 promise that resolves to undefined (void) or rejects with a {@link CorbelError}
          */
         move: function(destId, pos, options) {
          corbel.validate.value('destId', destId);
          var positionStartId = destId.indexOf('/');
          if (positionStartId !== -1){
            destId = destId.substring(positionStartId + 1);
          }

          options = this.getDefaultOptions(options);

          var args = corbel.utils.extend(options, {
             url: this.buildUri(this.type, this.srcId, this.destType, destId),
             contentType: 'application/json',
             data: {
                 '_order': '$pos(' + pos + ')'
             },
             method: corbel.request.method.PUT
          });

          return this.request(args);
         },

         /**
          * Deletes a relation between Resources
          * @method
          * @memberOf Resources.Relation
          * @param  {String} destId          Relationed resource
          * @return {Promise}                ES6 promise that resolves to undefined (void) or rejects with a {@link CorbelError}
          * @example
          * destId = 'music:Track/555'
          */
        delete: function(destId, options) {
          options = this.getDefaultOptions(options);

          var args = corbel.utils.extend(options, {
            url: this.buildUri(this.type, this.srcId, this.destType, destId),
            method: corbel.request.method.DELETE,
            Accept: options.dataType
          });

          return this.request(args);
        }
     });

     return corbel.Resources.Relation;

 })();
