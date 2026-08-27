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

        const newArticleResponse = await request.post(
    'https://conduit-api.bondaracademy.com/api/articles/',
    {
        data: {
        article: {
            title: `Test New Article ${Date.now()}`,
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
    
})

