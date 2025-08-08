---
layout: default
title: Projects
---

## Selected Projects

{% for project in site.data.projects %}
- [{{ project.name }}]({{ project.link }}) – {{ project.description }}
{% endfor %}
