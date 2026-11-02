import React from 'react';
import { createRoot } from 'react-dom/client';
import './atlas.css';
import './spiral.css';
const root=createRoot(document.getElementById('root')!);
root.render(<div className="boot-loading"><i/><span>Loading knowledge graph</span></div>);
import('./AtlasApp').then(({default:App})=>root.render(<React.StrictMode><App/></React.StrictMode>)).catch(()=>root.render(<div className="boot-loading"><span>The mathematics graph could not load.</span><small>Make sure the local server is running, then reload.</small><button onClick={()=>location.reload()}>Reload the atlas</button></div>));
