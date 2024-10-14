# 如何为项目添加 GitHub Issue Template

## 目的

用户提问题的时候可能不规范, 提供一个合适的问题模板可以提升效率

## 步骤

### 在项目下新建一个 `.github` 文件夹

### 在 `.github` 下新建一个 `ISSUE_TEMPLATE` 文件夹

### 在 `ISSUE_TEMPLATE` 下编写问题模板

例如下面的模板

``` yml
name: "🐞 Bug Report"
description: "Create a bug report to help us improve"
title: "[BUG]: "
labels:
  - "bug"
  - "enhancement"
assignees:
  - "KUN1007"

body:
  - type: textarea
    id: describe-the-bug
    attributes:
      label: "Describe the bug"
      description: "A clear and concise description of what the bug is."
      placeholder: "Please describe the bug here."
    validations:
      required: true
  
  - type: textarea
    id: steps-to-reproduce
    attributes:
      label: "Steps to Reproduce"
      description: "Provide the steps to reproduce the bug."
      placeholder: "1. Go to '...'\n2. Click on '....'\n3. Scroll down to '....'\n4. See error"
    validations:
      required: true

  - type: textarea
    id: expected-behavior
    attributes:
      label: "Expected behavior"
      description: "A clear and concise description of what you expected to happen."
      placeholder: "Describe what you expected to happen."
    validations:
      required: true

  - type: textarea
    id: screenshots
    attributes:
      label: "Screenshots"
      description: "If applicable, add screenshots to help explain your problem."
      placeholder: "Upload screenshots if possible."
  
  - type: textarea
    id: additional-context
    attributes:
      label: "Additional context"
      description: "Add any other context about the problem here."
      placeholder: "Any additional information that could help understand the issue."
```

模板的语法应是 yml

需要注意的是, 这里的 body 要求至少有一个非 markdown type，否则将会失败

### 模板排序

To control the order of your templates, prefix the filenames with a number.

For example: 1-bug.yml, 2-feature-request.yml, and 3-epic.yml.

## I18n (国际化)

可以将 `.github/ISSUE_TEMPLATE` 下的文件命名为

- 11-bug-report.yml
- 12-feature-request.yml
- 21-bug-report_JA_JP.yml
- 22-feature-request_JA_JP.yml

## 配置文件

可以在 `.github/ISSUE_TEMPLATE` 下新建一个 `config.yml` 文件来编写额外的配置

例如导航一个 Telegram 群组

``` yml
blank_issues_enabled: true
contact_links:
  - name: 🚀 Telegram
    url: https://t.me/kungalgame
    about: Our official telegram group.
```

这里类型检查的报错可以不用理会

## 完成效果

![](https://cdn.jsdelivr.net/gh/kun-moe/kun-image@main/blog/202410150311090.png)

## 官方文档

https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository
