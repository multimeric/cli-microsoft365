# spo cdn set

Enable or disable the specified Microsoft 365 CDN

## Usage

```sh
m365 spo cdn set [options]
```

## Options

`-e, --enabled <enabled>`
: Set to true to enable CDN or to false to disable it. Valid values are `true,false`

`-t, --type [type]`
: Type of CDN to manage. `Public,Private,Both`. Default `Public`

`--noDefaultOrigins`
: pass to not create the default Origins

--8<-- "docs/cmd/_global.md"

## Remarks

Using the `-t, --type` option you can choose whether you want to manage the settings of the Public (default), Private CDN or both. If you don't use the option, the command will use the Public CDN.

Using the `-e, --enabled` option you can specify whether the given CDN type should be enabled or disabled. Use true to enable the specified CDN and false to disable it.

Using the `--noDefaultOrigins` option you can specify to skip the creation of the default origins.

!!! important
    To use this command you have to have permissions to access the tenant admin site.

## Examples

Enable the Microsoft 365 Public CDN on the current tenant

```sh
m365 spo cdn set --type Public --enabled true
```

Disable the Microsoft 365 Public CDN on the current tenant

```sh
m365 spo cdn set --type Public --enabled false
```

Enable the Microsoft 365 Private CDN on the current tenant

```sh
m365 spo cdn set --type Private --enabled true
```

Enable the Microsoft 365 Private and Public CDN on the current tenant with default origins

```sh
m365 spo cdn set --type Both --enabled true
```

Enable the Microsoft 365 Private and Public CDN on the current tenant without default origins

```sh
m365 spo cdn set --type Both --enabled true --noDefaultOrigins
```

## More information

- Use Microsoft 365 CDN with SharePoint Online: [https://learn.microsoft.com/microsoft-365/enterprise/use-microsoft-365-cdn-with-spo?view=o365-worldwide](https://learn.microsoft.com/microsoft-365/enterprise/use-microsoft-365-cdn-with-spo?view=o365-worldwide)
