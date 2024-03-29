Ext.define('QuickD.view.NotApp', {
    extend: 'Ext.Panel',
    requires:[
    ],
    xtype: 'notapp',
    config: {
        layout:'fit',
        showAnimation: {
            type: 'fadeIn',
            duration: 500
        },
        hideAnimation: {
            type: 'fadeOut',
            duration: 500
        },
        // Make it modal so you can click the mask to hide the overlay
        hideOnMaskTap: false,
        hidden: true,
        styleHtmlContent: true,
        scrollable: true,
        id:'quickd-install-webapp',
        html: '<div id="install-webapp-dialogue"><div></div></div>'
    }
}); 