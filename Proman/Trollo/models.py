from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Status(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Board(models.Model):
    name = models.CharField(max_length=100)
    statuses = models.ManyToManyField(Status)

    def __str__(self):
        return self.name


class Card(models.Model):
    name = models.CharField(max_length=100)
    board_id = models.ForeignKey(Board, on_delete=models.CASCADE)
    status_id = models.ForeignKey(Status, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    boards = models.ManyToManyField(Board)
