from django.urls import path, include
from django.contrib.auth import views as auth_views

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('login', auth_views.login,
         {'template_name': 'Trollo/index.html'},
         name='login'),
    path('logout', auth_views.logout_then_login,
         {'login_url': 'login'},
         name='logout'),
    path('signup', views.signup, name='signup'),
    path('boards', views.boards, name='boards')
]
