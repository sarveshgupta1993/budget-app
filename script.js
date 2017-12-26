/*---------------------------------------------------------------------*/
//Budget Controller



var budgetController=(function(){
    
    //some code
    
    var Expenses=function(id,description,value)
    {
        this.id=id;
        this.description=description;
        this.value=value;
        this.percentages=-1;
        
    }
    
    var Income=function(id,description,value)
    {
        this.id=id;
        this.description=description;
        this.value=value;
    }
    
    
    Expenses.prototype.calcPercenatge=function(totalIncome){
        
        if(totalIncome>0)
            {
                this.percentages=Math.round((this.value/totalIncome)*100);
            }
        else
            this.percentages=-1;
    }
    
    Expenses.prototype.getPercentage=function(){
        return this.percentages;
    }
    
    
    
    var data={
        
        
        AllItems:{
            exp:[],
            inc:[]
        },
        
        totals:
        {
            exp:0,
            inc:0
        },
        Budget:0,
        percentage:-1
    }
    
    var calculate=function(type){
        var sum=0;
        data.AllItems[type].forEach(function(cur){
            sum=sum+cur.value;
            
        });
        data.totals[type]=sum;
        
        
    }
        
        //DELTE THE ITEM FROM UI
        
    
    
    
    return {
        
        addItems:function(type,des,val){
         var newItem,ID;
            
            if(data.AllItems[type].length>0)
                {
                  ID=data.AllItems[type][data.AllItems[type].length-1].id+1;  
                }
            else
                {
                    ID=0;
                }
            
            if(type==='exp')
                {
                    newItem=new Expenses(ID,des,val);
                }
            else if(type==='inc')
                {
                    newItem=new Income(ID,des,val) ;
                }
            
            data.AllItems[type].push(newItem);
            return newItem;
        },
        
        CalculateBudget:function(){
            
            //calcualte the totalincome and total expense
            calculate('exp');
            calculate('inc');
            //calcualte the budget totalincome-totalexpense
            data.Budget=data.totals.inc-data.totals.exp;
            
            //calculate the percentage
            data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);
            
            
        },
        
        CalcPercenatge:function(){
            
            data.AllItems.exp.forEach(function(cur){
                
                cur.calcPercenatge(data.totals.inc);
            });
            
        },
        
        getPercentage:function(){
            
            var allPer=data.AllItems.exp.map(function(cur){
                
                return cur.getPercentage();
            });
            return allPer;
            
        },
        
        getBudget:function(){
            
            return{
                Budget:data.Budget,
                totalincome:data.totals.inc,
                totalexpense:data.totals.exp,
                percent:data.percentage
            }
            
        },
        
        deleteItem:function(type,id){
        
        var ids,index;
            ids=data.AllItems[type].map(function(current) {
                return current.id;
            });
            index=ids.indexOf(id);
            
            if(index!==-1)
                {
                    data.AllItems[type].splice(index,1);
                }
        
        
    },
        
        
        testing:function(){
            console.log(data);
        }
        
    }
    
    
    
    
})();



/*--------------------------------------------------------------*/

//UI Controller

var UIController=(function(){
   
    var DOMSTRINGS={
        
        InputType:'.add__type',
        InputDescription:'.add__description',
        InputValue:'.add__value',
        InputBtn: '.add__btn',
        Incomecontainer:'.income__list',
        ExpenseContainer: '.expenses__list',
        totalincome:'.budget__income--value',
        totalexpense:'.budget__expenses--value',
        totalperce:'.budget__expenses--percentage',
        budgetvalue:'.budget__value',
        Container:'.container',
        ExpensePerLabel:'.item__percentage',
        CurrentTime:'.budget__title--month'
        
    };
      
      //format number
       var  formatNumber=function(num,type) {
            
                var numSplit,int,dec,type;
            num=Math.abs(num);
            num=num.toFixed(2);
            
            numSplit=num.split('.');
            int=numSplit[0];
            if(int.length>3){
                int=int.substr(0,int.length-3)+','+int.substr(int.length-3,3);
            }
            dec=numSplit[1];
            return (type==='exp'?'-':'+')+' '+int+'.'+dec;
            
            
            
        };
    
    return {
        getInput: function(){
              
            return {
                 type:document.querySelector(DOMSTRINGS.InputType).value,
        description:document.querySelector(DOMSTRINGS.InputDescription).value,
        value:parseFloat(document.querySelector(DOMSTRINGS.InputValue).value)
               };
        },
        
        
        //for display the items
        
        addListItem:function(obj,type){
            var html,element,newHtml;
            if(type==='inc')
                {
                    element=DOMSTRINGS.Incomecontainer;
            html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>' ;      
                    
                } 
            else if(type==='exp')
                {
                    element=DOMSTRINGS.ExpenseContainer;
                           
            html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>' ;   
                }
            newHtml=html.replace('%id%',obj.id);
            newHtml=newHtml.replace('%description%',obj.description);
            newHtml=newHtml.replace('%value%',formatNumber(obj.value,type));
            
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
            
        },
        
        //FUNCTION TO CLEAR THE INPUT FIELDS
        
        ClearFields:function(){
            var fields,fieldsArr;
            
            fields=document.querySelectorAll(DOMSTRINGS.InputDescription+','+DOMSTRINGS.InputValue);
            fieldsArr=Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function(current,index,array){
                
                current.value=" ";
                
            }),
                fieldsArr[0].focus();
            
            
        },
        
        //method to update the UI with the budget
        displayBudget:function(obj){
            var type;
            
            document.querySelector(DOMSTRINGS.totalincome).textContent=formatNumber(obj.totalincome,'inc');
            document.querySelector(DOMSTRINGS.totalexpense).textContent=formatNumber(obj.totalexpense,'exp');
            document.querySelector(DOMSTRINGS.budgetvalue).textContent=formatNumber(obj.Budget,obj.Budget>0 ? type='inc':'exp');
            if(obj.percent>0)
                {
                    document.querySelector(DOMSTRINGS.totalperce).textContent=obj.percent+'%';            
            
                }
            else{
                document.querySelector(DOMSTRINGS.totalperce).textContent='---';           
            
                }
            },
        
        
        //method to update the percenages in UI
        
        displayPercentages:function(percentages){
            var field=document.querySelectorAll(DOMSTRINGS.ExpensePerLabel);
            
            var nodeListForEach=function(list,callback){
                
                for(var i=0;i<list.length;i++)
                    {
                     callback(list[i],i);   
                    }
                
            };
            
            nodeListForEach(field,function(current,index){
               
                if(percentages[index]>0)
                    {
                        current.textContent=percentages[index]+'%';
                    }
                else
                    current.textContent='---';
                
            });
            
            
        },
        
        //method for current date time
        
        displayMonth:function(){
            
            
            var year,month,date;
            var now=new Date();
            year=now.getFullYear();
            months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
            month=months[now.getMonth()];
            date=now.getDate();
            document.querySelector(DOMSTRINGS.CurrentTime).textContent=year+' '+month+' '+date;
            
        },
      
        
        
        //delete the list item
        
        deleteListItem:function(selectorID){
            
          var el=document.getElementById(selectorID);
            el.parentNode.removeChild(el);
            
            
        },
        
        getDomstrings: function(){        
        return DOMSTRINGS;
            }
      
    };
  
   
    
    
})();



/*--------------------------------------------------------------------------------*/
//App controller

var controller=(function(budgetctrl,UIctrl)
{
    
    var setupeventlisteners=function(){
        var DOM =UIctrl.getDomstrings();
         document.querySelector(DOM.InputBtn).addEventListener('click',ctrlAddItem);
    
    //event key event
    
    document.addEventListener('keypress',function(event)
                             {
        if(event.keyCode===13 || event.which ===13)
            {
                ctrlAddItem();
            }
    });  
        
        
        //delete item
        document.querySelector(DOM.Container).addEventListener('click',ctrlDeleteItem);
        
        
    };
    
    
    
    //Budget Update controller
    
    var UpdateBudget=function(){
        
        //calcuale the budget
        budgetctrl.CalculateBudget();
        
        //return the budget 
        var Budget=budgetctrl.getBudget();
        
        //display budget on ui
        UIctrl.displayBudget(Budget);
        
        //call the update percenatge
        
       
        
        
    };
    
    //Budget percenatge controller
    
    var UpdatePercentage=function(){
        
        //calculate the percenatges
        
        budgetctrl.CalcPercenatge();
        //read percenatges from budget controller
        
        
        var percenatges=budgetctrl.getPercentage();
    //display percenatges to UI
        
        
        
        UIctrl.displayPercentages(percenatges);
    }
    
    
    
    
    var ctrlAddItem=function()
    {
        var result,newItem;
        
        
        // get the input data
         result=UIctrl.getInput();
     
        if(result.description!==" " && !isNaN(result.value) && result.value>0)
            {
             //add the budget item to budget controller
      newItem=  budgetctrl.addItems(result.type,result.description,result.value)
        
        //add the item to ui controller
        UIctrl.addListItem(newItem,result.type);
        //clear the input fields
        UIctrl.ClearFields();
        //calculate the budget
        UpdateBudget();
        UpdatePercentage();
        //display the result   
                
            }
        
        
    };
    
    
    //ctrldelete function
    
    
    var ctrlDeleteItem=function(event){
        var ItemId,SplitId,type,ID;
        ItemId=event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(ItemId){
            
            SplitId=ItemId.split('-');
            type=SplitId[0];
            ID=parseInt(SplitId[1]);
            
        }
        
        //DELETE THE ITEM FROM DATA STRUCTURE
        
        budgetctrl.deleteItem(type,ID);
        
        
        //DELETE THE ITEM FROM UI
        UIctrl.deleteListItem(ItemId);
        
        
        //UPDATE AND SHOW THE NEW BUDGET
        UpdateBudget();
        UpdatePercentage();
        
        
        
    }
    
    //Button click event
    return{
        init:function(){
            console.log('Application is been started')
            UIctrl.displayBudget({
                Budget:0,
                totalincome:0,
                totalexpense:0,
                percent:-1
            })
        setupeventlisteners();
            UIctrl.displayMonth();
        
    }
        
        
    }
   
    
})(budgetController,UIController)

controller.init();