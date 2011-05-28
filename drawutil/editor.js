dojo.provide("drawutil.editor");

dojo.require("dijit._Templated");
dojo.require("dijit._Widget");

dojo.require("dojox.gfx");
dojo.require("drawutil.block");

dojo.declare("drawutil.editor", [ dijit._Widget, dijit._Templated ],
{
	templatePath			: dojo.moduleUrl("drawutil", "editor.html"),
    surface                 : "", // Can be provided, otherwise we create a new surface
    entities                : [],
    
    postCreate: function()
    {
        this.inherited(arguments);
        console.log("postCreate in drawutil.editor called");
        if(!this.surface)
        {
		    this.surface = dojox.gfx.createSurface(this.editordiv, 400, 400);
        }
        //----
        this.test();
    },
    
    test: function()
    {
        this.addEntity(new drawutil.block({surface: this.surface, model: {x:100, y: 200, height:40, width: 88} })); 
    },
    
    addEntity: function(e)
    {
        this.entities.push(e);
    }
});