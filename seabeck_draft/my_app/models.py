from django.contrib.auth.models import User
from django.db import models
from datetime import *
# Classes:
# Family


# USER TYPES

class Family(models.Model):
    # first_name = models.CharField(max_length=50)
    # last_name = models.CharField(max_length=50)
    # email = models.EmailField()
    user = models.OneToOneField(User)
    phone = models.CharField(max_length=15)  # will create validation later

    street_address = models.CharField(max_length=50, default="")
    apt_no = models.CharField(max_length=15, default="")
    city = models.CharField(max_length=50, default="")
    state = models.CharField(max_length=2, default="WA")
    zip_code = models.CharField(max_length=5, default="")

    ec_1_first = models.CharField(max_length=50, default="")
    ec_1_last = models.CharField(max_length=50, default="")
    ec_1_phone = models.CharField(max_length=50, default="")
    ec_1_relation = models.CharField(max_length=50, default="")

    ec_2_first = models.CharField(max_length=50, default="")
    ec_2_last = models.CharField(max_length=50, default="")
    ec_2_phone = models.CharField(max_length=50, default="")
    ec_2_relation = models.CharField(max_length=50, default="")

    total_owed = models.DecimalField(max_digits=20, decimal_places=4, default=0)
    total_paid = models.DecimalField(max_digits=20, decimal_places=4, default=0)

    def __str__(self):
        return self.user.first_name + " " + self.user.last_name

    def __unicode__(self):
        return self.user.first_name + " " + self.user.last_name


class Staff(models.Model):

    user = models.ForeignKey(User)
    is_admin = models.BooleanField(default=False)
    is_webmaster = models.BooleanField(default=False)


# Campers
class Camper(models.Model):
    family = models.ForeignKey(Family)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    under_18 = models.BooleanField(default=False)
    dob = models.DateField(null=True, blank=True)

    is_vegetarian = models.BooleanField(default=False)
    is_vegan = models.BooleanField(default=False)
    is_gf = models.BooleanField(default=False)
    is_df = models.BooleanField(default=False)

    def __str__(self):
        return self.first_name + " " + self.last_name

    def __unicode__(self):
        return unicode(self.first_name + " " + self.last_name)


class EventYear(models.Model):
    start_date = models.DateField()
    end_date = models.DateField()

    def get_year(self):
        return int(self.start_date.year)

    def __str__(self):
        return "Camp Year " + str(self.start_date.year)

    def __unicode__(self):
        return unicode("Camp Year ") + unicode(self.start_date.year)


class SchoolGroup(models.Model):
    name = models.CharField(max_length=20)

    def __str__(self):
        return self.name

    def __unicode__(self):
        return self.name


class Grade(models.Model):
    code = models.IntegerField()
    name = models.CharField(max_length=20)
    school_group = models.ForeignKey(SchoolGroup)

    def __str__(self):
        return self.name

    def __unicode__(self):
        return self.name


class Attendance(models.Model):  # i.e. Campers by year
    event_year = models.ForeignKey(EventYear)
    camper = models.ForeignKey(Camper)
    grade = models.ForeignKey(Grade, default=15)
    sponsor = models.CharField(null=True, blank=True, default=None, max_length=50)
    sponsor_phone = models.CharField(null=True, blank=True, default=None, max_length=15)

    def age_at_start(self):
        try:
            return int(self.event_year.get_year()) - int(self.camper.dob.year)
            #need to fix this to use specific date
        except:
            return "unknown age"

    def __str__(self):
        return self.camper.first_name + " " + self.camper.last_name + " - " + str(self.event_year)

    def __unicode__(self):
        return self.camper.first_name + " " + self.camper.last_name + " - " + unicode(self.event_year)



class Shirt(models.Model):
    size_name = models.CharField(max_length=10)

    def __str__(self):
        return self.size_name

    def __unicode__(self):
        return self.size_name

    # instead make 6 instances of shirt with size assigned


class ShirtOrder(models.Model):
    attendance = models.ForeignKey(Attendance)  # recursion
    shirt = models.ForeignKey(Shirt)  # recursion

    def __str__(self):
        return "Camper: " + str(self.attendance) \
               + " shirt order: " + self.shirt.size_name

    def __unicode__(self):
        return "Camper: " + unicode(self.attendance) \
               + " shirt order: " + self.shirt.size_name


# class MeatPreference(models.Model):
#     preference_name = models.TextField(max_length=20)
#
#     def __str__(self):
#         return self.preference_name
#
#     def __unicode__(self):
#         return self.preference_name


# class AllergyType(models.Model):
#     type_name = models.TextField(max_length=20)
#
#     def __str__(self):
#         return self.type_name
#
#     def __unicode__(self):
#         return self.type_name


class FoodPreference(models.Model):
    camper = models.ForeignKey(Camper)
    # meat_pref = models.ForeignKey(MeatPreference)
    # gluten_free = models.BooleanField()
    # dairy_free = models.BooleanField()
    # other = models.TextField()
    # severity = models.ForeignKey(AllergyType)  # change eventually to new table.

    vegan = models.BooleanField(default=False)
    vegetarian = models.BooleanField(default=False)
    gluten_free = models.BooleanField(default=False)
    dairy_free = models.BooleanField(default=False)

    def __str__(self):
        output = ""
        if self.vegan:
            output += "vegan, "
        if self.vegetarian:
            output += "vegetarian, "
        if self.gluten_free:
            output += "gluten free, "
        if self.dairy_free:
            output += "dairy free, "
        return output[:-2]

    def __unicode__(self):

        output = ""
        if self.vegan:
            output += "vegan, "
        if self.vegetarian:
            output += "vegetarian, "
        if self.gluten_free:
            output += "gluten free, "
        if self.dairy_free:
            output += "dairy free, "
        return unicode(output[:-2])



# Rates
class Rate(models.Model):
    # find out how to restrict this to preset types e.g. housing, registration, tshirt
    type = models.CharField(max_length=20)
    # e.g. SM (if tshirt), Pines (if housing)
    item = models.IntegerField()
    cost_per = models.DecimalField(max_digits=20, decimal_places=4)  # do as dollars or as cents???

    def __str__(self):
        return "type: " + self.type \
               + "item: " + self.item \
               + "rate: $" + str(self.cost_per)

    def __unicode__(self):
        return "type: " + self.type \
               + "item: " + self.item \
               + "rate: $" + str(self.cost_per)

