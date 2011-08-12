dojo.provide("boxgraph.boxmanager");


dojo.declare("boxgraph.boxmanager", null,
{
    boxes:      [],
    
    constructor: function()
    {
        this.boxes = [];  
    },
    
    addBox: function(box)
    {
        this.boxes.push(box);
    },
    
    getBoxes: function()
    {
        return this.boxes;   
    }
    
});