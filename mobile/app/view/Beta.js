Ext.define('QuickD.view.Beta', {
    extend: 'Ext.Panel',
    requires:[
    ],
    xtype: 'betaview',
    config: {
        layout:'fit',
        // We give it a left and top property to make it floating by default    
        left: 0,
        top: 0,
        width: "90%",
        height: "80%",
        opacity: 0.5,
        // Make it modal so you can click the mask to hide the overlay
        modal: true,
        hideOnMaskTap: false,
        hidden: true,
        styleHtmlContent: true,
        scrollable: true,
        id:'quickd-beta-screen',
        items: [{
            xtype:'panel',
            html:'Ja tak'
        }]
    }
}); 