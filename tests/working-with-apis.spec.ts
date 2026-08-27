import {test, expect} from '@playwright/test';
import tags from '../test-data/tags.json';

test('has title', async({page})=> {
    await page.route('*/**/api/tags', async (route)=> {
    await route.fulfill({
       
        json: tags
      })

    })
     await page.route('*/**/api/articles*',async route =>{
        
        const response = await route.fetch();
        const responseJSON = await response.json();
        responseJSON.articles[0].title = 'This is a MOCK title for the article';
        responseJSON.articles[0].description = 'This is a MOCK description for the article';
        await route.fulfill({
            json: responseJSON

        })
     })

    await page.goto('https://conduit.bondaracademy.com/');
    
    await expect(page.locator('.navbar-brand')).toHaveText(/conduit/);
    await expect(page.locator('.sidebar .tag-pill')).toContainText(['Automation', 'Playwright']);
    await expect(page.locator('.preview-link h1').first()).toContainText('This is a MOCK title for the article');
    await expect(page.locator('.preview-link p').first()).toContainText('This is a MOCK description for the article');
});

test('Delete article', async({page, request})=>{
     const loginResponse = await request.post('https://conduit-api.bondaracademy.com/api/users/login',{
       data: {
         "user": {
            "email": process.env.TEST_EMAIL,
            "password": process.env.TEST_PASSWORD
           }
         }
      })
      expect((loginResponse).status()).toEqual(200);
      const responseLoginJSON = await loginResponse.json();
      const token = responseLoginJSON.user.token;

      const articleTitle = `Test New Article ${Date.now()}`;
      const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/',
    {
    
        data: {
        article: {
            title: articleTitle,
            description: 'Test-Description',
            body: 'Test-Body-Text',
            tagList: []
        }
        },
        headers: {
        Authorization: `Token ${token}`
        }
    }
    );
    expect(newArticleResponse.status()).toEqual(201);
    console.log(await newArticleResponse.json());

    await page.goto('https://conduit.bondaracademy.com/');
    // The test app does not refresh the article list after API creation.
    // UI login is used as a workaround to reload the latest data.
    await page.getByText('Sign in').click();
    await page.getByRole('textbox', { name: 'Email' }).fill(process.env.TEST_EMAIL!);
    await page.getByRole('textbox', { name: 'Password' }).fill(process.env.TEST_PASSWORD!);   
    await page.getByRole('button', {name: 'Sign in'}).click();


    
    await expect(page.getByText(articleTitle)).toBeVisible();
    await page.getByText(articleTitle).click();
    await page.getByRole('button',{name: 'Delete Article'}).first().click(); 
    await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0');
    await expect(page.getByText(articleTitle)).not.toBeVisible();
   

    });


