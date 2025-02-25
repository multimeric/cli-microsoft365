# spo applicationcustomizer get

Get an application customizer that is added to a site.

## Usage

```sh
m365 spo applicationcustomizer get [options]
```

## Options

`-u, --webUrl <webUrl>`
: URL of the site.

`-t, --title [title]`
: The title of the Application Customizer. Specify either `title`, `id`, or `clientSideComponentId`.

`-i, --id [id]`
: The id of the Application Customizer. Specify either `title`, `id`, or `clientSideComponentId`.

`-c, --clientSideComponentId  [clientSideComponentId]`
: The Client Side Component Id (GUID) of the application customizer. Specify either `title`, `id`, or `clientSideComponentId`.

`-s, --scope [scope]`
: Scope of the application customizer. Allowed values: `Site`, `Web`, `All`. Defaults to `All`.

--8<-- "docs/cmd/_global.md"

## Examples

Retrieves an application customizer by title.

```sh
m365 spo applicationcustomizer get --title "Some customizer" --webUrl https://contoso.sharepoint.com/sites/sales
```

Retrieves an application customizer by id.

```sh
m365 spo applicationcustomizer get --id 14125658-a9bc-4ddf-9c75-1b5767c9a337 --webUrl https://contoso.sharepoint.com/sites/sales
```

Retrieves an application customizer by clientSideComponentId.

```sh
m365 spo applicationcustomizer get --clientSideComponentId 7096cded-b83d-4eab-96f0-df477ed7c0bc --webUrl https://contoso.sharepoint.com/sites/sales
```

Retrieves an application customizer by title available at the site scope.

```sh
m365 spo applicationcustomizer get --title "Some customizer" --webUrl https://contoso.sharepoint.com/sites/sales --scope site
```

## Response

=== "JSON"

    ```json
    {
      "ClientSideComponentId": "7096cded-b83d-4eab-96f0-df477ed7c0bc",
      "ClientSideComponentProperties": "",
      "CommandUIExtension": null,
      "Description": null,
      "Group": null,
      "Id": "14125658-a9bc-4ddf-9c75-1b5767c9a337",
      "ImageUrl": null,
      "Location": "ClientSideExtension.ApplicationCustomizer",
      "Name": "Some customizer",
      "RegistrationId": null,
      "RegistrationType": 0,
      "Rights": "{\"High\":0,\"Low\":0}",
      "Scope": "Web",
      "ScriptBlock": null,
      "ScriptSrc": null,
      "Sequence": 0,
      "Title": "Some customizer",
      "Url": null,
      "VersionOfUserCustomAction": "16.0.1.0"
    }
    ```

=== "Text"

    ```text
    ClientSideComponentId        : 7096cded-b83d-4eab-96f0-df477ed7c0bc
    ClientSideComponentProperties:
    CommandUIExtension           : null
    Description                  : null
    Group                        : null
    Id                           : 14125658-a9bc-4ddf-9c75-1b5767c9a337
    ImageUrl                     : null
    Location                     : ClientSideExtension.ApplicationCustomizer
    Name                         : Some customizer
    RegistrationId               : null
    RegistrationType             : 0
    Rights                       : {"High":0,"Low":0}
    Scope                        : Web
    ScriptBlock                  : null
    ScriptSrc                    : null
    Sequence                     : 0
    Title                        : Some customizer
    Url                          : null
    VersionOfUserCustomAction    : 16.0.1.0
    ```

=== "CSV"

    ```csv
    ClientSideComponentId,ClientSideComponentProperties,CommandUIExtension,Description,Group,Id,ImageUrl,Location,Name,RegistrationId,RegistrationType,Rights,Scope,ScriptBlock,ScriptSrc,Sequence,Title,Url,VersionOfUserCustomAction
    7096cded-b83d-4eab-96f0-df477ed7c0bc,,,,,14125658-a9bc-4ddf-9c75-1b5767c9a337,,ClientSideExtension.ApplicationCustomizer,Some customizer,,0,"{""High"":0,""Low"":0}",Web,,,0,Some customizer,,16.0.1.0
    ```

=== "Markdown"

    ```md
    # spo applicationcustomizer get --title "Some customizer" --webUrl "https://nachan365.sharepoint.com/sites/spdemo" --scope "Web"

    Date: 3/6/2023

    ## Some customizer (14125658-a9bc-4ddf-9c75-1b5767c9a337)

    Property | Value
    ---------|-------
    ClientSideComponentId | 7096cded-b83d-4eab-96f0-df477ed7c0bc
    ClientSideComponentProperties |
    CommandUIExtension | null
    Description | null
    Group | null
    Id | 14125658-a9bc-4ddf-9c75-1b5767c9a337
    ImageUrl | null
    Location | ClientSideExtension.ApplicationCustomizer
    Name | Some customizer
    RegistrationId | null
    RegistrationType | 0
    Rights | {"High":0,"Low":0}
    Scope | Web
    ScriptBlock | null
    ScriptSrc | null
    Sequence | 0
    Title | Some customizer
    Url | null
    VersionOfUserCustomAction | 16.0.1.0
    ```
