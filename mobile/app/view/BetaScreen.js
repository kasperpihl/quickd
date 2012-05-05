Ext.define('QuickD.view.BetaScreen', {
    extend: 'Ext.form.Panel',
    requires:[
        'Ext.form.Panel',
        'Ext.Label',
        'Ext.form.FieldSet',
        'Ext.Img'
    ],
    xtype: 'betascreen',
    config: {
        layout:'vbox',
        // We give it a left and top property to make it floating by default    
        centered:true,
        width: 300,
        height:300,
        scrollable:false,
        showAnimation: {
            type: 'fadeIn',
            duration: 500
        },
        hideAnimation: {
            type: 'fadeOut',
            duration: 500
        },
        // Make it modal so you can click the mask to hide the overlay
        modal: true,
        hideOnMaskTap: false,
        hidden: true,
        styleHtmlContent: false,
        id:'quickd-beta-screen',
        items: [
        {
            xtype:'fieldset',
            
            instructions:'',
            items:[{
                xtype:'image',
                src: ROOT_URL+'resources/images/keys.png',
                width:90,
                margin:'0 auto',
                mode:'image'
            },{
                xtype:'textfield',
                placeHolder:'Indtast din betanøgle',
                id:'betakeyField',
                width:'265px',
                listeners:{
                    focus:function(){ this.getParent().getParent().gotFocus(); }
                }
            }]
        },{
            xtype:'button',

            padding: '7 0 7 0',
            margin:'6px 0',
            
            ui:'confirm',
            id:'useBetaKey',
            text:'Log ind'
        },{
            xtype:'button',
            right:0,
            left:0,
            bottom:10,
            id: 'requestKeyButton',
            text: 'Anmod om en betanøgle'
        }]
    },
    gotFocus:function(){
        if(this.errorShown) this.removeError();
        return;
    },
    removeError:function(){
        if(!this.errorShown) return false;
        this.errorShown = false;
        this.down('fieldset').setInstructions('');
    },
    showError:function(text){
        if(this.errorShown) return false;
        this.errorShown = true;
        this.down('fieldset').setInstructions('Den indtastede betakode er forkert');
    }
}); 