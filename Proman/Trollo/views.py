from django.contrib.auth import login, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, redirect

# Create your views here.


def index(request):
    return render(request, 'Trollo/index.html')


def signup(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=raw_password)
            login(request, user)
            return redirect('boards')
    else:
        form = UserCreationForm()
    return render(request, 'Trollo/index.html', {'form': form})


@login_required
def boards(request):
    return render(request, 'Trollo/boards.html')
