module App.Terminal where

import Prelude

import CSS (background, black, color, green, height, vh)
import CSS as CSS
import Data.Maybe (Maybe(..))
import Effect (Effect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.CSS as HCSS
import Halogen.HTML.Properties as HP
import Halogen.HTML.Properties (class_, prop)

type State
  = { actions :: Array { stdin :: String, stdout :: String } }

data Action
  = Clear

component :: forall q i o m. H.Component HH.HTML q i o m
component =
  H.mkComponent
    { initialState: \_ -> { actions: [] }
    , render
    , eval: H.mkEval $ H.defaultEval { handleAction = handleAction }
    }


render :: forall cs m. State -> H.ComponentHTML Action cs m
render state =
  HH.div
    [ HCSS.style do
        background black
        color green
        height $ vh 100.0
    ]
    -- [ HP.class_ $ (HH.ClassName "baz") ]
    -- [ State.actions (map fromExample examples) ]
    [ HH.text "Hello World!" ]

handleAction :: forall cs o m. Action -> H.HalogenM State Action cs o m Unit
handleAction = case _ of
  Clear -> H.modify_ \st -> st { actions = [] }
