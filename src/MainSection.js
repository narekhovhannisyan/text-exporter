/* @flow */

import React, { PureComponent } from 'react'
import { bindActionCreators } from 'redux'

import { connect } from 'react-redux'

import { chooseThemeAction } from 'redux/actions/project'
import { onTabChange } from 'redux/actions/globals'
import { onTitleChange, resetProject, resetScreen } from 'redux/actions/project'
import {
  getTitle,
  hasTheme,
  hasColor,
  getProject,
  getGlobals,
  getThemeData,
  getUploadingFiles,
  getProjectFormattedDuration,
  getUploadingFilesPercentage
} from 'selectors/index'

import ScreenEditor from 'apps/advanced/components/screen-editor/index.js'
import MusicEditor from 'apps/common/music-editor/index'
import ColorEditor from 'apps/common/color-editor/index'
import ThemeChooser from 'molecules/theme-chooser'
import PreviewProject from 'apps/common/preview-project'

import { AdvancedHeader } from 'molecules/headers'
import { Col, Row } from 'atoms/grid'
import { PanelAction, PanelStandard } from 'molecules/panels'
import Switch, { Case } from 'atoms/component-switch'
import colors from 'atoms/colors'
import EditableText from 'molecules/editable-text'
import Icon from 'atoms/icon'
import Text from 'atoms/text'
import DialogDangerConfirm from 'atoms/dialog-danger-confirm'

import { formatVideoDuration } from 'lib/utils'
import { advancedTabs } from 'apps/common/tabs'
import Button from 'atoms/button'
import CircularLoading from 'atoms/circularLoading'

type IMainSectionProps = {
  onTabChange: (s: string) => Object,
  onTitleChange: (s: string) => void,
  resetProject: () => void,
  resetScreen: () => void,
  projectDuration?: number,
  title: string,
  hasTheme: boolean,
  hasColor: boolean,
  activeTab: string,
  project: IProject,
  themeData: IProjectThemeData | null,
  chooseThemeAction: (value: string) => void,
  resetScreen: () => void,
  resetProject: () => void,
  blobsCount: number,
  percent: number
}

const mapStateToProps = (state: IEditorState) => {
  return {
    project: getProject(state),
    title: getTitle(state),
    projectDuration: getProjectFormattedDuration(state),
    hasTheme: hasTheme(state),
    hasColor: hasColor(state),
    themeData: getThemeData(state),
    activeTab: getGlobals(state).activeTab,
    warningType: getGlobals(state).warningType,
    blobsCount: getUploadingFiles(state).length,
    percent: getUploadingFilesPercentage(state)
  }
}

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      onTabChange,
      onTitleChange,
      chooseThemeAction,
      resetScreen,
      resetProject
    },
    dispatch
  )

class MainSection extends PureComponent<*, IMainSectionProps, *> {
  constructor (props: IMainSectionProps) {
    super(props)
    this.state = {
      showRemoveAlert: false
    }
  }

  getResetButtons () {
    return (
      <div className='reset-btn-group'>
        <Button onClick={() => this.props.resetScreen()} size='small'>
          <Text className='t-project' textSize='small' color={colors.mainGrey}>
            Reset Screen
          </Text>
        </Button>
        <Button
          className='project'
          onClick={() => this.setState({ showRemoveAlert: true })}
          size='small'>
          <Text className='t-project' textSize='small' color={colors.mainGrey}>
            Reset Project
          </Text>
        </Button>
        {this.confirmationDialog()}
      </div>
    )
  }

  confirmationDialog () {
    const { showRemoveAlert } = this.state
    return (
      <DialogDangerConfirm
        open={showRemoveAlert}
        onConfirm={() => this.resetProject()}
        onCancel={() => this.setState({ showRemoveAlert: false })}
        cancelLabel={<Text>No</Text>}>
        <Text>Are you sure you want to reset your project?</Text>
      </DialogDangerConfirm>
    )
  }

  resetProject () {
    this.props.resetProject()
    this.setState({ showRemoveAlert: false })
  }

  showUploadingFiles () {
    const { blobsCount, percent } = this.props
    if (blobsCount) {
      return (
        <span style={{ marginRight: '1rem' }}>
          <Text style={{ color: colors.mainBlue, marginRight: '0.5rem' }}>
            Uploading Files
          </Text>
          <CircularLoading size={20} thickness={2} color={colors.mainBlue} />
        </span>
      )
    }
    return null
  }

  render () {
    const {
      projectDuration,
      title,
      onTabChange,
      activeTab,
      onTitleChange,
      project,
      hasTheme,
      hasColor,
      themeData,
      chooseThemeAction,
      blobsCount
    } = this.props

    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
        <div className='root-container'>
          <AdvancedHeader
            onTabChange={onTabChange}
            activeTab={activeTab}
            tabs={advancedTabs(hasTheme, hasColor, blobsCount)}
          />
          <PanelStandard fill={colors.lightGrey30} className='truncate'>
            <section>
              <Text className='title'>Title: &nbsp;</Text>
              <div>
                <EditableText
                  text={title}
                  defaultText={title}
                  onChange={onTitleChange}
                  inputStyle={{ height: 36 }}
                  icon={
                    <Icon
                      name='edit_line'
                      size='xsmall'
                      style={{ marginLeft: 5 }}
                    />
                  }
                  textStyle={{ maxWidth: 400 }}
                />
              </div>
              {activeTab === 'TAB_ADVANCED_EDIT'
                ? this.getResetButtons()
                : null}
            </section>
            <section className='video-duration'>
              {this.showUploadingFiles()}
              <Text>Video duration:</Text>
              {projectDuration
                ? <Text>
                  {formatVideoDuration(projectDuration)} <Text>min</Text>
                </Text>
                : <Text>Flexible</Text>}
            </section>
          </PanelStandard>
        </div>
        <div className='resizeables-parent'>
          <Switch condition={activeTab}>
            <Case value={'TAB_ADVANCED_EDIT'}>
              <ScreenEditor />
            </Case>
            <Case value={'TAB_ADVANCED_STYLE'}>
              {themeData
                ? <ThemeChooser
                  chooseTheme={chooseThemeAction}
                  themeData={themeData}
                  />
                : 'No Theme'}
            </Case>
            <Case value={'TAB_ADVANCED_COLOR'}>
              <ColorEditor />
            </Case>
            <Case value={'TAB_ADVANCED_MUSIC'}>
              <MusicEditor />
            </Case>
            <Case value={'TAB_ADVANCED_PREVIEW'}>
              <PreviewProject />
            </Case>
          </Switch>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainSection)
