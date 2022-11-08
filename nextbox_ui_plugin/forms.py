from django import forms
from django.conf import settings

from django.utils.translation import gettext as _

from dcim.models import Device, Site, Region, DeviceRole, Location, Rack

from .models import SavedTopology

from django import forms
from dcim.choices import DeviceStatusChoices
from tenancy.models import TenantGroup, Tenant
from tenancy.forms import TenancyFilterForm
from django.conf import settings
from netbox.forms import NetBoxModelFilterSetForm
from utilities.forms import (BootstrapMixin, TagFilterField, DynamicModelMultipleChoiceField, MultipleChoiceField)

class TopologyFilterForm(TenancyFilterForm, NetBoxModelFilterSetForm):
    model = Device
    fieldsets = (
        # (None, ('q',)),
        (None, ('tenant_group_id', 'tenant_id',)),
        (None, ('region_id', 'site_id', 'location_id', 'rack_id')),
        (None, ('device_role_id','id','status', )),
        (None, ('tag', )),
    )

    region_id = DynamicModelMultipleChoiceField(
        queryset=Region.objects.all(),
        required=False,
        label=_('Region')
    )
    device_role_id = DynamicModelMultipleChoiceField(
        queryset=DeviceRole.objects.all(),
        required=False,
        label=_('Device Role')
    )
    id = DynamicModelMultipleChoiceField(
        queryset=Device.objects.all(),
        required=False,
        label=_('Device'),
        query_params={
            'location_id' : '$location_id',
            'region_id': '$region_id',
            'site_id': '$site_id',
            'role_id': '$device_role_id',
        },
    )
    site_id = DynamicModelMultipleChoiceField(
        queryset=Site.objects.all(),
        required=False,
        query_params={
            'region_id': '$region_id',
        },
        label=_('Site')
    )
    location_id = DynamicModelMultipleChoiceField(
        queryset=Location.objects.all(),
        required=False,
        query_params={
            'region_id': '$region_id',
            'site_id': '$site_id',
        },
        label=_('Location')
    )
    rack_id = DynamicModelMultipleChoiceField(
        queryset=Rack.objects.all(),
        required=False,
        query_params={
            'region_id': '$region_id',
            'site_id': '$site_id',
            'location_id': '$location_id',
        },
        label=_('Rack')
    )
    status = MultipleChoiceField(
        choices=DeviceStatusChoices,
        required=False,
        label=_("Device Status")
    )
    tag = TagFilterField(model)

class LoadSavedTopologyFilterForm(BootstrapMixin, forms.Form):

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user', None)
        super(LoadSavedTopologyFilterForm, self).__init__(*args, **kwargs)
        self.fields['saved_topology_id'].queryset = SavedTopology.objects.filter(created_by=user)

    model = SavedTopology

    saved_topology_id = forms.ModelChoiceField(
        queryset=None,
        to_field_name='id',
        required=True
    )
