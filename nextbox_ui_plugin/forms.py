from django import forms
from ipam.models import VLAN
from utilities.forms import (
    BootstrapMixin,
    DynamicModelMultipleChoiceField,
    DynamicModelChoiceField
)
from .models import SavedTopology
from dcim.models import Device, Site, Region, Location
from tenancy.models import Tenant
from django.conf import settings
from packaging import version
from django.utils.translation import gettext


class TopologyFilterForm(BootstrapMixin, forms.Form):
    model = Device

    device_id = DynamicModelMultipleChoiceField(
        queryset=Device.objects.all(),
        to_field_name='id',
        required=False,
        null_option='None',
    )
    location_id = DynamicModelMultipleChoiceField(
        queryset=Location.objects.all(),
        required=False,
        to_field_name='id',
        null_option='None',
    )
    site_id = DynamicModelMultipleChoiceField(
        queryset=Site.objects.all(),
        required=False,
        to_field_name='id',
        null_option='None',
    )
    tenant_id = DynamicModelMultipleChoiceField(
        queryset=Tenant.objects.all(),
        required=False,
        to_field_name='id',
        null_option='None',
    )
    vlan_id = DynamicModelChoiceField(
        queryset=VLAN.objects.all(),
        required=False,
        to_field_name='id',
        null_option='None',
    )
    region_id = DynamicModelMultipleChoiceField(
        queryset=Region.objects.all(),
        required=False,
        to_field_name='id',
        null_option='None',
    )
    device_id.label = gettext('Devices')
    location_id.label = gettext('Location')
    site_id.label = gettext('Sites')
    tenant_id.label = gettext('Tenants')
    vlan_id.label = gettext('Vlan')
    region_id.label = gettext('Regions')


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