import json

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission
from django.test import TestCase
from django.urls import reverse


class CustomerListTests(TestCase):
    def setUp(self):
        get_user_model().objects.create_user(phone_number='00000000001')
        get_user_model().objects.create_user(phone_number='00000000002', is_vip=True)
        get_user_model().objects.create_user(phone_number='00000000003', is_vip=True, is_banned=True)
        get_user_model().objects.create_user(phone_number='00000000004', is_banned=True)
        admin = get_user_model().objects.create_user(
            phone_number='11122223333',
            password='123456',
            is_staff=True
        )
        permission = Permission.objects.get(codename='view_customuser')
        admin_group = Group.objects.create(name='customer_admin')
        admin_group.permissions.add(permission)
        admin_group.save()
        admin.groups.add(admin_group)
        admin.save()

    def test_customer_list_access_denied(self):
        self.client.force_login(get_user_model().objects.get(phone_number='00000000001'))

        response = self.client.get(
            reverse('api:customers:backstage:get-customer-list'),
            {
                'customer_id': '',
                'username': '',
                'phone_number': '',
                'is_vip': '',
                'is_banned': '',
                'page': 1,
                'page_limit': 1
            }
        )
        self.assertEqual(response.status_code, 302)

    def test_customer_list_no_filter(self):
        self.client.login(phone_number='11122223333', password='123456')

        response = self.client.get(
            reverse('api:customers:backstage:get-customer-list'),
            {
                'customer_id': '',
                'username': '',
                'phone_number': '',
                'is_vip': '',
                'is_banned': '',
                'page': 1,
                'page_limit': 1
            }
        )
        self.assertEqual(response.status_code, 200)
        response_json_data = json.loads(response.content)
        self.assertEqual(response_json_data['content'][0]['phone_number'], '00000000004')
        self.assertEqual(response_json_data['count'], 4)

    def test_customer_list_banned_vip(self):
        self.client.login(phone_number='11122223333', password='123456')

        response = self.client.get(
            reverse('api:customers:backstage:get-customer-list'),
            {
                'customer_id': '',
                'username': '',
                'phone_number': '',
                'is_vip': '2',
                'is_banned': '2',
                'page': 1,
                'page_limit': 1
            }
        )
        self.assertEqual(response.status_code, 200)
        response_json_data = json.loads(response.content)
        self.assertEqual(response_json_data['content'][0]['phone_number'], '00000000003')
        self.assertEqual(response_json_data['count'], 1)
