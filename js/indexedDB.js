function CIndexedDB(name){
    var obj={
        name:name,
        version:2,
        db:null,
            // 创建或打开数据库及表格
        createDB:function(){
            var defer= $.Deferred();
            var indexedDB = window.indexedDB || window.webkitIndexedDB ||window.mozIndexedDB;
            var that=this;
            var request=indexedDB.open(this.name,this.version);
            request.onerror=function(e){
                defer.reject();
                return defer.promise();
            };
            request.onsuccess=function(e){
                that.db=e.target.result;
                console.log(that.db)
                return defer.promise();
            };
        },
        createStore: function (store,callback) {
                this.version++;
                var defer= $.Deferred();
                var indexedDB = window.indexedDB || window.webkitIndexedDB ||window.mozIndexedDB;
                var that=this;
                var request=indexedDB.open(this.name,this.version);
                    request.onerror=function(e){

                        defer.reject();
                        return defer.promise();
                    };
                    request.onupgradeneeded=function(e){

                        that.db=e.target.result;
                        if(!that.db.objectStoreNames.contains(store)){
                            that.db.createObjectStore(store,{keyPath:"id",autoIncrement:true});
                        }
                        console.log('DB version changed to '+that.version);
                        callback();

                    };


            },
        closeDB:function(){
            this.db.close();
        },
        destroy:function(){
            this.db.deleteDatabase(this.name);
        },
        //添加数据
        addData:function (store,obj){
            console.log(this.db)
            var transaction=this.db.transaction(store,'readwrite');
            var storeObj=transaction.objectStore(store);
            storeObj.add(obj);
        },
         //读取数据
        getDataByKey:function (store,key){
            var transaction=this.db.transaction(store,'readwrite');
            var storeObj=transaction.objectStore(store);
            var request=storeObj.get(parseInt(key));
            request.onsuccess=function(e){
                var result=e.target.result;
                $("#result").html(JSON.stringify(result));
            };
        },

        updateDataByKey:function (store,key){
            var transaction=this.db.transaction(store,'readwrite');
            var storeObj=transaction.objectStore(store);
            var request=storeObj.get(parseInt(key));
            request.onsuccess=function(e){
                var result=e.target.result;
                result.name=1;
                result.answer=2;
                storeObj.put(result);
            };
        }
        /*
        function readAll(dbinfo){
            var list=[];
            var transaction=dbinfo.db.transaction(dbinfo.store,'readwrite');
            var store=transaction.objectStore(dbinfo.store);
            // 打开游标，遍历store中所有数据
            store.openCursor().onsuccess = function(event) {

                var cursor = event.target.result;
                if (cursor) {
                    list.push(cursor.value);
                    cursor.continue();
                }
                $("#all").html(JSON.stringify(list));
            }
        }
         */
    };
    return obj;
}
