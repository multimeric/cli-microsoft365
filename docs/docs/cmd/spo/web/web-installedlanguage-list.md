# spo web installedlanguage list

Lists all installed languages on site

## Usage

```sh
m365 spo web installedlanguage list [options]
```

## Options

`-u, --webUrl <webUrl>`
: URL of the site for which to retrieve the list of installed languages

--8<-- "docs/cmd/_global.md"

## Examples

Return all installed languages from site _https://contoso.sharepoint.com/_

```sh
m365 spo web installedlanguage list --webUrl https://contoso.sharepoint.com
```

## Response

=== "JSON"

    ```json
    [ 
      {
        "DisplayName": "English",
        "LanguageTag": "en-US",
        "Lcid": 1033
      }
    ]
    ```

=== "Text"

    ```text
    DisplayName                 LanguageTag  Lcid
    --------------------------  -----------  -----
    English                     en-US        1033
    ```

=== "CSV"

    ```csv
    DisplayName,LanguageTag,Lcid
    English,en-US,1033
    ```

=== "Markdown"

    ```md
    # spo web installedlanguage list --webUrl "https://contoso.sharepoint.com"

    Date: 4/10/2023

    ## English

    Property | Value
    ---------|-------
    DisplayName | English
    LanguageTag | en-US
    Lcid | 1033   
    ```
