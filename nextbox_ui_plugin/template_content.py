from extras.plugins import PluginTemplateExtension
from django.conf import settings

class SiteTopologyButton(PluginTemplateExtension):
    """
    Extend the DCIM site template to include content from this plugin.
    """
    model = 'dcim.site'

    def buttons(self):
        return self.render('nextbox_ui_plugin/topology_button.html')

class TenantTopologyButton(PluginTemplateExtension):
    """
    Extend the DCIM tenant template to include content from this plugin.
    """
    model = 'tenancy.tenant'

    def buttons(self):
        return self.render('nextbox_ui_plugin/topology_button.html')

# PluginTemplateExtension subclasses must be packaged into an iterable named
# template_extensions to be imported by NetBox.
template_extensions = [SiteTopologyButton, TenantTopologyButton]